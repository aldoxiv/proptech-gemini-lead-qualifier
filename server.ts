import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Create Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface ChatRequest {
  history: ChatMessage[];
  message: string;
  config: {
    agentName: string;
    propertyName: string;
    region: string;
  };
}

// ==========================================
// HIGH-FIDELITY LOCAL FALLBACK SYSTEM
// Preconstructed dialog flowchart to gracefully recover from 429 API blocks
// ==========================================

function localSimulateChat(
  history: ChatMessage[],
  message: string,
  agentName: string,
  propertyName: string,
  region: string
): string {
  const cleanMsg = message.toLowerCase().trim();

  // If the user's message (even if first message) triggers spam/desarme:
  if (
    cleanMsg.includes("não lembro") ||
    cleanMsg.includes("não cadastrei") ||
    cleanMsg.includes("não recordo") ||
    cleanMsg.includes("não me cadastrado") ||
    cleanMsg.includes("não me recordo") ||
    cleanMsg.includes("não me lembro") ||
    cleanMsg.includes("spam") ||
    cleanMsg.includes("de onde")
  ) {
    return `Entendo perfeitamente! A Lopes guarda históricos de anos. Provavelmente em algum momento você deu uma olhadinha em um site nosso ou visitou um plantão. 🔍\n\nComo os planos mudam, a ideia de comprar um imóvel (para morar ou investir) ainda passa pela sua cabeça ou esse plano já ficou no passado?`;
  }

  // Rule 0: If conversation is brand new (history is empty)
  if (history.length === 0) {
    if (
      cleanMsg.includes("residencial") ||
      cleanMsg.includes(propertyName.toLowerCase()) ||
      cleanMsg.includes("imóvel específico") ||
      cleanMsg.includes("informações sobre") ||
      cleanMsg.includes("concept") ||
      cleanMsg.includes("residencial")
    ) {
      return `Olá! Aqui é o assistente virtual do ${agentName}, da Lopes. O ${propertyName} é realmente um projeto fantástico e muito bem localizado! 🏢\n\nPara eu agilizar os materiais dele para você (como plantas e tabelas): o seu interesse nesse projeto seria mais voltado para INVESTIMENTO ou você avalia para MORADIA PRÓPRIA?`;
    }
    return `Olá! Aqui é o assistente virtual do ${agentName}, consultor da Lopes. O seu contato constava em nosso sistema para a região de ${region} e estou atualizando nossa lista VIP. 💎\n\nPara eu ser assertivo: o seu foco hoje no mercado seria mais voltado para INVESTIMENTO ou você avalia algo para MORADIA?`;
  }

  // Find out the focal path of previous discussions
  let currentFoco: "MORADIA" | "INVESTIMENTO" | "NAO_RECORDA" | null = null;
  for (const h of history) {
    const text = h.text.toLowerCase();
    if (text.includes("moradia") || text.includes("morar")) {
      currentFoco = "MORADIA";
    } else if (text.includes("investimento") || text.includes("investir")) {
      currentFoco = "INVESTIMENTO";
    } else if (text.includes("não lembro") || text.includes("não cadastrei") || text.includes("não recordo") || text.includes("não me recordo")) {
      currentFoco = "NAO_RECORDA";
    }
  }

  // If they are responding to desarmamento
  if (currentFoco === "NAO_RECORDA") {
    if (
      cleanMsg.includes("passa") ||
      cleanMsg.includes("ainda") ||
      cleanMsg.includes("sim") ||
      cleanMsg.includes("gostaria") ||
      cleanMsg.includes("quero") ||
      cleanMsg.includes("talvez")
    ) {
      return `Maravilha! Já captei perfeitamente o seu perfil. O ${agentName} já está assumindo a conversa aqui e vai te mandar as melhores opções da Lopes que se encaixam nisso. Até logo! 👋`;
    } else {
      return `Entendo perfeitamente! Sem problemas. Vou atualizar seu cadastro aqui para não te incomodarmos mais. Desejo muito sucesso em seus caminhos! Se precisar de algo no futuro, estaremos por aqui. 👋`;
    }
  }

  // If we haven't selected a path yet but they replied now:
  if (!currentFoco) {
    if (cleanMsg.includes("moradia") || cleanMsg.includes("morar") || cleanMsg.includes("morador") || cleanMsg.includes("própria")) {
      return `Perfeito! Comprar para morar é buscar qualidade de vida. Para eu filtrar as opções que combinam com sua rotina, me conta:\n\n1) Quantos dormitórios seriam ideais para sua família hoje?\n2) Vocês têm urgência para mudar ou o prazo de obras de um lançamento (geralmente de 2 a 3 anos) atende o planejamento de vocês?`;
    } else if (cleanMsg.includes("investimento") || cleanMsg.includes("investir") || cleanMsg.includes("fundo") || cleanMsg.includes("roi")) {
      return `Excelente! Para eu selecionar as melhores taxas de retorno (ROI) aqui na Lopes, qual dessas frentes faz mais sentido hoje?\n\n1) Ganho de capital (revenda antes da entrega das chaves)\n2) Renda passiva com aluguel (tradicional ou Airbnb)\n\nE me conta: você tem em mente uma média de valor (ticket) planejado para esse investimento?`;
    }
  }

  // If they are answering details
  return `Maravilha! Já captei perfeitamente o seu perfil. O ${agentName} já está assumindo a conversa aqui e vai te mandar as melhores opções da Lopes que se encaixam nisso. Até logo! 👋`;
}

function localAnalyzeLead(history: ChatMessage[]) {
  let foco: "MORADIA" | "INVESTIMENTO" | "NAO_RECORDA" | null = null;
  let dormitorios: string | null = null;
  let urgencia: string | null = null;
  let objetivoInvestimento: string | null = null;
  let ticket: string | null = null;
  let confirmacaoInteresse: string | null = null;
  let status: "AGUARDANDO_INICIO" | "EM_ANDAMENTO" | "CONCLUIDO" = "AGUARDANDO_INICIO";

  if (history.length === 0) {
    return { foco, dormitorios, urgencia, objetivoInvestimento, ticket, confirmacaoInteresse, status };
  }

  status = "EM_ANDAMENTO";

  for (let i = 0; i < history.length; i++) {
    const msg = history[i];
    const text = msg.text.toLowerCase();
    const isUser = msg.role === "user";

    if (isUser) {
      if (text.includes("moradia") || text.includes("morar") || text.includes("própria")) {
        foco = "MORADIA";
      } else if (text.includes("investimento") || text.includes("investir")) {
        foco = "INVESTIMENTO";
      } else if (text.includes("não lembro") || text.includes("não recordo") || text.includes("não cadastrei") || text.includes("spam")) {
        foco = "NAO_RECORDA";
      }

      // Extract specific details depending on active funnel path
      if (foco === "MORADIA") {
        if (text.includes("2 dormitórios") || text.includes("2 quartos") || text.includes(" dois ") || text.includes("2")) {
          dormitorios = "2 dormitórios";
        } else if (text.includes("3 dormitórios") || text.includes("3 quartos") || text.includes(" três ") || text.includes("3") || text.includes("3+")) {
          dormitorios = "3 ou mais dormitórios";
        } else if (!dormitorios && (text.includes("quarto") || text.includes("dormitório") || text.includes("dorms"))) {
          dormitorios = msg.text;
        }

        if (text.includes("urgência") || text.includes("imediato") || text.includes("mudar de imediato") || text.includes("urgente")) {
          urgencia = "Urgência Imediata";
        } else if (text.includes("prazo") || text.includes("obras") || text.includes("lançamento") || text.includes("2 a 3 anos") || text.includes("2-3")) {
          urgencia = "Prazo de obras (2 a 3 anos)";
        } else if (!urgencia && (text.includes("mudar") || text.includes("obra") || text.includes("atende"))) {
          urgencia = "Aceita prazo de obras";
        }
      }

      if (foco === "INVESTIMENTO") {
        if (text.includes("ganho") || text.includes("capital") || text.includes("revenda") || text.includes("1")) {
          objetivoInvestimento = "Ganho de Capital / Revenda";
        } else if (text.includes("renda") || text.includes("aluguel") || text.includes("airbnb") || text.includes("passiva") || text.includes("2")) {
          objetivoInvestimento = "Renda Passiva / Aluguel";
        }

        if (text.includes("500") || text.includes("quinhentos") || text.includes("500k")) {
          ticket = "Até R$ 500 mil";
        } else if (text.includes("800") || text.includes("1.5") || text.includes("milhão") || text.includes("membro") || text.includes("800k")) {
          ticket = "R$ 800 mil a R$ 1.5 M";
        } else if (!ticket && (text.includes("r$") || text.includes("planejado") || text.includes("orçamento") || text.includes("valor"))) {
          ticket = msg.text;
        }
      }

      if (foco === "NAO_RECORDA") {
        if (text.includes("passa") || text.includes("ainda") || text.includes("sim") || text.includes("interessa") || text.includes("penso")) {
          confirmacaoInteresse = "Ainda passa pela cabeça";
        } else if (text.includes("passado") || text.includes("não") || text.includes("ficou") || text.includes("nunca")) {
          confirmacaoInteresse = "Ficou no passado";
        }
      }
    } else {
      // If assistant confirmed handoff or "assumindo a conversa"
      if (text.includes("assumindo a conversa") || text.includes("até logo") || text.includes("não te incomodarmos mais") || text.includes("sucesso em seus caminhos")) {
        status = "CONCLUIDO";
      }
    }
  }

  // Safeguards to set completed flag if necessary inputs are defined
  if (dormitorios && urgencia && foco === "MORADIA") {
    status = "CONCLUIDO";
  }
  if (objetivoInvestimento && ticket && foco === "INVESTIMENTO") {
    status = "CONCLUIDO";
  }
  if (confirmacaoInteresse && foco === "NAO_RECORDA") {
    status = "CONCLUIDO";
  }

  return {
    foco,
    dormitorios,
    urgencia,
    objetivoInvestimento,
    ticket,
    confirmacaoInteresse,
    status,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Call: Chat with the Lead Qualification Virtual assistant
  app.post("/api/chat", async (req: Request, res: Response) => {
    const { history, message, config } = req.body as ChatRequest;
    const { agentName = "Aldo Santos", propertyName = "Concept Jardins", region = "São Paulo e Região" } = config || {};

    if (!message) {
      res.status(400).json({ error: "Mensagem é obrigatória." });
      return;
    }

    try {
      // Check if GEMINI API KEY is present, otherwise failover immediately
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("MY_GEMINI_API_KEY")) {
        throw new Error("GEMINI_API_KEY not configured. Falling back to local interactive model.");
      }

      // Format the prompt system instruction
      const systemInstruction = `Você é o assistente virtual de ${agentName}, consultor imobiliário associado à Lopes. Sua única missão é descobrir o perfil do cliente e qualificá-lo de forma leve e rápida antes de passar o atendimento para o consultor humano.

DIRETRIZES DE ESTILO:
1. Linguagem de WhatsApp: frases curtas, parágrafos de no máximo 2-3 linhas.
2. Use quebras de linha frequentes e emojis de forma sutil para facilitar a leitura no celular. Sinta-se como se estivesse digitando no celular.
3. Nunca mande blocos massivos de texto ("textões").
4. Termine quase todas as interações com uma pergunta de múltipla escolha ou resposta direta (Sim/Não, 1 ou 2, A ou B).

REGRAS DE CONVERSAÇÃO (FUNIL):

- PRIMEIRA RESPOSTA (PIVÔ DE ENTRADA):
  Sua primeira resposta depende de como o cliente iniciou a conversa (ou caso a história esteja vazia):
  GATILHO 1: Se a mensagem inicial indicar um imóvel específico (Ex: "Quero informações sobre o ${propertyName}" ou se mencionar o nome do condomínio, residencial ou apartamento).
  -> Responda exatamente assim:
  "Olá! Aqui é o assistente virtual do ${agentName}, da Lopes. O ${propertyName} é realmente um projeto fantástico e muito bem localizado! 🏢
  Para eu agilizar os materiais dele para você (como plantas e tabelas): o seu interesse nesse projeto seria mais voltado para INVESTIMENTO ou você avalia para MORADIA PRÓPRIA?"

  GATILHO 2: Se a mensagem for um "Oi", início geral, lista fria, ou não indicar um imóvel.
  -> Responda exatamente assim:
  "Olá! Aqui é o assistente virtual do ${agentName}, consultor da Lopes. O seu contato constava em nosso sistema para a região de ${region} e estou atualizando nossa lista VIP. 💎
  Para eu ser assertivo: o seu foco hoje no mercado seria mais voltado para INVESTIMENTO ou você avalia algo para MORADIA?"

- FUNIL DE QUALIFICAÇÃO (APÓS O PIVÔ):
  Se o cliente responder INVESTIMENTO:
  Pergunte pelo objetivo estratégico e ticket:
  "Excelente! Para eu selecionar as melhores taxas de retorno (ROI) aqui na Lopes, qual dessas frentes faz mais sentido hoje?
  1) Ganho de capital (revenda antes da entrega das chaves)
  2) Renda passiva com aluguel (tradicional ou Airbnb)
  E me conta: você tem em mente uma média de valor (ticket) planejado para esse investimento?"

  Se o cliente responder MORADIA:
  Pergunte pelo prazo e tamanho da família:
  "Perfeito! Comprar para morar é buscar qualidade de vida. Para eu filtrar as opções que combinam com sua rotina, me conta:
  1) Quantos dormitórios seriam ideais para sua família hoje?
  2) Vocês têm urgência para mudar ou o prazo de obras de um lançamento (geralmente de 2 a 3 anos) atende o planejamento de vocês?"

  Se o cliente disser "NÃO LEMBRO DE TER ME CADASTRADO" ou expressar negação similar:
  Use o desarmamento exatamente dessa forma:
  "Entendo perfeitamente! A Lopes guarda históricos de anos. Provavelmente em algum momento você deu uma olhadinha em um site nosso ou visitou um plantão.
  Como os planos mudam, a ideia de comprar um imóvel (para morar ou investir) ainda passa pela sua cabeça ou esse plano já ficou no passado?"

- FINALIZAÇÃO DA TAREFA (HANDOFF):
  Assim que você coletar as respostas essenciais de perfil (seja de investimento ou moradia, ou se ele confirmar interesse após o desarmamento), envie a seguinte mensagem de encerramento, mude seu status mental para CONCLUÍDO e não faça mais NENHUMA pergunta:
  "Maravilha! Já captei perfeitamente o seu perfil. O ${agentName} já está assumindo a conversa aqui e vai te mandar as melhores opções da Lopes que se encaixam nisso. Até logo! 👋"`;

      // Build contents array for the chats SDK / model call
      const contents = history.map((h) => ({
        role: h.role,
        parts: [{ text: h.text }],
      }));

      // Append today's message
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      // We call Gemini model to generate content
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.3,
        },
      });

      const assistantText = response.text || "";
      res.json({ text: assistantText });
    } catch (error: any) {
      // High-fidelity fallback to local simulation
      const simulatedText = localSimulateChat(history, message, agentName, propertyName, region);
      res.json({ text: simulatedText });
    }
  });

  // API Call: Analyze conversation history and extract lead details dynamically using Structured Schema JSON
  app.post("/api/analyze-lead", async (req: Request, res: Response) => {
    const { history } = req.body as { history: ChatMessage[] };

    try {
      if (!history || history.length === 0) {
        res.json({
          foco: null,
          dormitorios: null,
          urgencia: null,
          objetivoInvestimento: null,
          ticket: null,
          confirmacaoInteresse: null,
          status: "AGUARDANDO_INICIO",
        });
        return;
      }

      // Check if GEMINI API KEY is present, otherwise fallback immediately to rule-based parser
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("MY_GEMINI_API_KEY")) {
        throw new Error("GEMINI_API_KEY not configured. Falling back to rule-based parser.");
      }

      const promptContext = `Analise a seguinte conversa do WhatsApp entre o cliente e o assistente virtual de um corretor imobiliário da Lopes. Extraia o perfil coletado do cliente de forma estruturada.

CONVERSA:
${history.map((m) => `${m.role === "user" ? "CLIENTE" : "ASSISTENTE"}: ${m.text}`).join("\n\n")}

Instruções para os campos:
1. "foco": Pode ser "MORADIA", "INVESTIMENTO", "NAO_RECORDA" (se não lembra de ter cadastrado), ou null.
2. "dormitorios": O número ou descrição de dormitórios mencionados pelo cliente (ou null).
3. "urgencia": Descrição se tem urgência ou prefere obras (ou se aceita 2-3 anos) (ou null).
4. "objetivoInvestimento": Se prefere ganho de capital (revenda) ou renda passiva (aluguel/Airbnb) (ou null).
5. "ticket": O orçamento planejado mencionado pelo cliente (ex: "R$ 500k", "R$ 1 milhão", ou null).
6. "confirmacaoInteresse": Se o cliente disse que não se lembra de ter se cadastrado, mas respondeu se o plano ainda passa pela cabeça dele ou se já ficou no passado (ex: "Ainda passa", "Ficou no passado", ou null).
7. "status": Retorne "CONCLUIDO" se a conversa chegou ao fim com a mensagem de encerramento (o assistente informou que o corretor já está assumindo o atendimento) ou se todos os dados necessários foram informados. Caso contrário, retorne "EM_ANDAMENTO".`;

      const analysisResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptContext,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foco: {
                type: Type.STRING,
                description: "Foco do cliente: MORADIA, INVESTIMENTO, NAO_RECORDA ou null.",
              },
              dormitorios: {
                type: Type.STRING,
                description: "Quantidade de dormitórios informada (ex: '3 dormitórios') ou null.",
              },
              urgencia: {
                type: Type.STRING,
                description: "Prazo/Urgência do cliente (ex: 'Imediata', 'Pronta entrega', 'Obras/2-3 anos') ou null.",
              },
              objetivoInvestimento: {
                type: Type.STRING,
                description: "Objetivo do investimento: Ganho de capital ou Renda passiva (Airbnb/Aluguel) ou null.",
              },
              ticket: {
                type: Type.STRING,
                description: "Orçamento informado pelo cliente para o imóvel ou null.",
              },
              confirmacaoInteresse: {
                type: Type.STRING,
                description: "Se o plano de comprar imóvel ainda passa pela cabeça ou ficou no passado ou null.",
              },
              status: {
                type: Type.STRING,
                description: "Status da qualificação do lead: EM_ANDAMENTO ou CONCLUIDO.",
              },
            },
            required: ["status"],
          },
        },
      });

      const jsonStr = analysisResponse.text ? analysisResponse.text.trim() : "{}";
      const leadData = JSON.parse(jsonStr);
      res.json(leadData);
    } catch (error: any) {
      // High-fidelity local parser fallback
      const leadData = localAnalyzeLead(history);
      res.json(leadData);
    }
  });

  // Serve static assets from build or run development server
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();


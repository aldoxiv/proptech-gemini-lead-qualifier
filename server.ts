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

  // If the user's message triggers spam/desarme:
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
    return `Entendo perfeitamente! A Lopes guarda históricos de anos. Provavelmente você olhou um site nosso no passado. Como os planos mudam, a ideia de comprar um imóvel (para morar ou investir) ainda passa pela sua cabeça ou esse plano já ficou no passado?`;
  }

  // Rule 0: If conversation is brand new
  if (history.length === 0) {
    if (
      cleanMsg.includes("residencial") ||
      cleanMsg.includes(propertyName.toLowerCase()) ||
      cleanMsg.includes("imóvel específico") ||
      cleanMsg.includes("informações sobre") ||
      cleanMsg.includes("concept")
    ) {
      return `Olá! Aqui é o assistente do ${agentName}, da Lopes. O ${propertyName} é excelente, uma escolha fantástica! Para eu já separar as plantas e a tabela certa para você: o seu foco nele seria para INVESTIMENTO ou você avalia para MORADIA PRÓPRIA?`;
    }
    return `Olá! Aqui é o assistente do ${agentName}, consultor da Lopes. O seu contato constava em nosso sistema para a região de ${region} e estou atualizando nossa lista VIP. Para eu ser assertivo: o seu foco hoje no mercado seria mais voltado para INVESTIMENTO ou você avalia algo para MORADIA?`;
  }

  const fullHistory: ChatMessage[] = [...history, { role: "user", text: message }];
  const analyzed = localAnalyzeLead(fullHistory);
  
  const currentFoco = analyzed.foco;

  if (currentFoco === "NAO_RECORDA") {
    if (analyzed.confirmacaoInteresse === "Ainda passa pela cabeça") {
      return `Maravilha! E para eu te direcionar ao material certo, o seu foco hoje seria mais voltado para INVESTIMENTO ou MORADIA?`;
    } else if (analyzed.confirmacaoInteresse === "Ficou no passado") {
      return `Entendo perfeitamente! Sem problemas. Vou atualizar seu cadastro aqui para não te incomodarmos mais. Desejo muito sucesso em seus caminhos! 👋`;
    } else {
      if (
        cleanMsg.includes("não") ||
        cleanMsg.includes("passado") ||
        cleanMsg.includes("ficou") ||
        cleanMsg.includes("nunca")
      ) {
        return `Entendo perfeitamente! Sem problemas. Vou atualizar seu cadastro aqui para não te incomodarmos mais. Desejo muito sucesso em seus caminhos! 👋`;
      } else if (
        cleanMsg.includes("passa") ||
        cleanMsg.includes("ainda") ||
        cleanMsg.includes("sim") ||
        cleanMsg.includes("gostaria") ||
        cleanMsg.includes("quero") ||
        cleanMsg.includes("talvez") ||
        cleanMsg.includes("penso")
      ) {
        return `Maravilha! E para eu te direcionar ao material certo, o seu foco hoje seria mais voltado para INVESTIMENTO ou MORADIA?`;
      } else {
        return `Entendo perfeitamente! Sem problemas. Vou atualizar seu cadastro aqui para não te incomodarmos mais. Desejo muito sucesso em seus caminhos! 👋`;
      }
    }
  }

  if (currentFoco === "MORADIA") {
    if (!analyzed.dormitorios) {
      return `Parabéns! Escolher um lar é um passo fabuloso para a família. 🏠 Para eu filtrar as opções ideais para vocês, me conta: quantos dormitórios (quartos) seriam ideais hoje?`;
    }
    if (!analyzed.urgencia) {
      return `Perfeito! E sobre o momento de vocês: vocês têm urgência para mudar (imóvel pronto) ou o prazo de obras de um lançamento (geralmente de 2 a 3 anos) atende o planejamento de vocês? 🏗️`;
    }
    if (!analyzed.regiaoEstilo) {
      return `Entendido! Além disso, qual é a prioridade no dia a dia de vocês: preferem focar em ficar mais perto de alguma região/bairro específico (por trabalho/escola) ou priorizam um condomínio com lazer de clube bem completo? 📍`;
    }
  }

  if (currentFoco === "INVESTIMENTO") {
    if (!analyzed.objetivoInvestimento) {
      return `Excelente escolha! O mercado imobiliário é perfeito para rentabilizar patrimônio. 📈 Para direcionar as melhores taxas de retorno, qual dessas frentes faz mais sentido para seu projeto hoje?
1) Ganho de capital (revenda antes da entrega das chaves)
2) Renda com locação (aluguel tradicional ou Airbnb)`;
    }
    if (!analyzed.experiencia) {
      return `Faz total sentido! E me conta uma coisa para eu alinhar nossa proposta: você já costuma investir em imóveis ou este seria o seu primeiro projeto nesse mercado? 💼`;
    }
    if (!analyzed.ticket) {
      return `Perfeito, anotado. E para fecharmos o seu perfil com chave de ouro: qual o valor aproximado (ticket) ou capacidade de aporte que você planeja para esse investimento hoje? 💰`;
    }
  }

  // Final Handoff Output:
  return `Sensacional! Coletei todas as informações e montei o seu mapa de perfil. O ${agentName} já está analisando o nosso estoque exclusivo na Lopes e vai assumir essa conversa em instantes para te apresentar as opções perfeitas. Até logo! 👋`;
}

function localAnalyzeLead(history: ChatMessage[]) {
  let foco: "MORADIA" | "INVESTIMENTO" | "NAO_RECORDA" | null = null;
  let dormitorios: string | null = null;
  let urgencia: string | null = null;
  let objetivoInvestimento: string | null = null;
  let ticket: string | null = null;
  let experiencia: string | null = null;
  let regiaoEstilo: string | null = null;
  let confirmacaoInteresse: string | null = null;
  let status: "AGUARDANDO_INICIO" | "EM_ANDAMENTO" | "CONCLUIDO" = "AGUARDANDO_INICIO";

  if (history.length === 0) {
    return { foco, dormitorios, urgencia, objetivoInvestimento, ticket, experiencia, regiaoEstilo, confirmacaoInteresse, status };
  }

  status = "EM_ANDAMENTO";

  for (let i = 0; i < history.length; i++) {
    const msg = history[i];
    const text = msg.text.toLowerCase().trim();
    const isUser = msg.role === "user";

    if (isUser) {
      // Determine focal path if not set:
      if (!foco) {
        if (text.includes("moradia") || text.includes("morar") || text.includes("própria")) {
          foco = "MORADIA";
        } else if (text.includes("investimento") || text.includes("investir")) {
          foco = "INVESTIMENTO";
        } else if (text.includes("não lembro") || text.includes("não recordo") || text.includes("não cadastrei") || text.includes("spam")) {
          foco = "NAO_RECORDA";
        }
      } else {
        // If foco is already set, subsequent messages fill fields in order
        if (foco === "MORADIA") {
          // Fill based on what is missing OR extract smartly
          // 1. Dormitórios
          if (!dormitorios) {
            if (text.includes("2") || text.includes("dois") || text.includes("duas") || text.includes("dias") || text.includes("dormitórios") || text.includes("quartos")) {
              if (text.includes("3") || text.includes("três") || text.includes("quatro") || text.includes("4")) {
                dormitorios = "3 ou mais dormitórios";
              } else {
                dormitorios = "2 dormitórios";
              }
            } else if (text.includes("3") || text.includes("três") || text.includes("+") || text.includes("mais")) {
              dormitorios = "3 ou mais dormitórios";
            }
          }
          // 2. Urgência / Prazo
          else if (!urgencia) {
            if (text.includes("pronto") || text.includes("urgência") || text.includes("urgente") || text.includes("imediato")) {
              urgencia = "Urgência Imediata (Pronto)";
            } else if (text.includes("obras") || text.includes("prazo") || text.includes("lançamento") || text.includes("anos") || text.includes("atende")) {
              urgencia = "Prazo de Obras (Lançamento)";
            }
          }
          // 3. Região / Estilo
          else if (!regiaoEstilo) {
            if (text.includes("trabalho") || text.includes("escola") || text.includes("perto") || text.includes("bairro") || text.includes("região")) {
              regiaoEstilo = "Perto do Trabalho / Escola";
            } else if (text.includes("lazer") || text.includes("clube") || text.includes("completo") || text.includes("piscina")) {
              regiaoEstilo = "Condomínio Lazer Clube";
            } else {
              regiaoEstilo = msg.text; // fallback
            }
          }
        } else if (foco === "INVESTIMENTO") {
          // 1. Objetivo
          if (!objetivoInvestimento) {
            if (text.includes("ganho") || text.includes("capital") || text.includes("revenda") || text.includes("valorização") || text.includes("1")) {
              objetivoInvestimento = "Ganho de Capital / Revenda";
            } else if (text.includes("renda") || text.includes("locação") || text.includes("aluguel") || text.includes("passiva") || text.includes("airbnb") || text.includes("2")) {
              objetivoInvestimento = "Renda com Locação";
            }
          }
          // 2. Experiência
          else if (!experiencia) {
            if (text.includes("primeiro") || text.includes("primeira") || text.includes("estou começando") || text.includes("novo") || text.includes("1")) {
              experiencia = "Primeiro investimento";
            } else if (text.includes("costumo") || text.includes("já invisto") || text.includes("experiente") || text.includes("já tenho") || text.includes("2")) {
              experiencia = "Já investe em imóveis";
            }
          }
          // 3. Ticket
          else if (!ticket) {
            if (text.includes("500") || text.includes("quinhentos") || text.includes("500k") || text.includes("1")) {
              ticket = "Em torno de R$ 500 mil";
            } else if (text.includes("800") || text.includes("1.5") || text.includes("milhão") || text.includes("membro") || text.includes("800k") || text.includes("2")) {
              ticket = "R$ 800 mil a R$ 1.5 M";
            } else {
              ticket = msg.text; // fallback
            }
          }
        } else if (foco === "NAO_RECORDA") {
          if (!confirmacaoInteresse) {
            if (text.includes("não") || text.includes("passado") || text.includes("ficou") || text.includes("nunca")) {
              confirmacaoInteresse = "Ficou no passado";
            } else if (text.includes("sim") || text.includes("ainda") || text.includes("passa") || text.includes("considero")) {
              confirmacaoInteresse = "Ainda passa pela cabeça";
            }
          } else if (confirmacaoInteresse === "Ainda passa pela cabeça") {
            if (text.includes("moradia") || text.includes("morar") || text.includes("própria")) {
              foco = "MORADIA";
            } else if (text.includes("investimento") || text.includes("investir")) {
              foco = "INVESTIMENTO";
            }
          }
        }
      }
    } else {
      // If assistant confirmed handoff or complete
      if (text.includes("sensacional") || text.includes("anotei tudo aqui") || text.includes("coletei todas as informações") || text.includes("assumir essa conversa") || text.includes("sucesso em seus caminhos")) {
        status = "CONCLUIDO";
      }
    }
  }

  // Fallbacks if user skips or if they typed general match:
  for (let i = 0; i < history.length; i++) {
    const msg = history[i];
    const text = msg.text.toLowerCase();
    
    if (msg.role === "user") {
      // Extract anywhere in text
      if (text.includes("moradia") || text.includes("morar") || text.includes("própria")) {
        foco = "MORADIA";
      } else if (text.includes("investimento") || text.includes("investir")) {
        foco = "INVESTIMENTO";
      }

      if (foco === "MORADIA") {
        if (!dormitorios) {
          if (text.includes("2 dorm") || text.includes("2 quart") || text.includes("2 d") || text.includes("dois dorm") || text.includes("dois quart")) {
            dormitorios = "2 dormitórios";
          } else if (text.includes("3 dorm") || text.includes("3 quart") || text.includes("3 d") || text.includes("três dorm") || text.includes("três quart") || text.includes("3+")) {
            dormitorios = "3 ou mais dormitórios";
          }
        }
        if (!urgencia) {
          if (text.includes("pronto") || text.includes("urgência") || text.includes("urgente") || text.includes("imediata") || text.includes("imediato")) {
            urgencia = "Urgência Imediata (Pronto)";
          } else if (text.includes("obras") || text.includes("prazo") || text.includes("lançamento") || text.includes("2 a 3 anos") || text.includes("2-3") || text.includes("atende")) {
            urgencia = "Prazo de Obras (Lançamento)";
          }
        }
        if (!regiaoEstilo) {
          if (text.includes("trabalho") || text.includes("escola") || text.includes("perto de") || text.includes("região") || text.includes("bairro")) {
            regiaoEstilo = "Perto do Trabalho / Escola";
          } else if (text.includes("lazer") || text.includes("clube") || text.includes("completo") || text.includes("clube")) {
            regiaoEstilo = "Condomínio Lazer Clube";
          }
        }
      } else if (foco === "INVESTIMENTO") {
        if (!objetivoInvestimento) {
          if (text.includes("ganho") || text.includes("capital") || text.includes("revenda") || text.includes("valorização")) {
            objetivoInvestimento = "Ganho de Capital / Revenda";
          } else if (text.includes("renda") || text.includes("locação") || text.includes("aluguel") || text.includes("passiva") || text.includes("airbnb")) {
            objetivoInvestimento = "Renda com Locação";
          }
        }
        if (!experiencia) {
          if (text.includes("primeiro") || text.includes("primeira") || text.includes("estou começando") || text.includes("novo")) {
            experiencia = "Primeiro investimento";
          } else if (text.includes("costumo") || text.includes("já invisto") || text.includes("experiente") || text.includes("já tenho")) {
            experiencia = "Já investe em imóveis";
          }
        }
        if (!ticket) {
          if (text.includes("500") || text.includes("quinhentos") || text.includes("500k")) {
            ticket = "Em torno de R$ 500 mil";
          } else if (text.includes("800") || text.includes("1.5") || text.includes("milhão") || text.includes("membro") || text.includes("800k")) {
            ticket = "R$ 800 mil a R$ 1.5 M";
          }
        }
      }
    }
  }

  // Set completed flags
  if (foco === "MORADIA" && dormitorios && urgencia && regiaoEstilo) {
    status = "CONCLUIDO";
  }
  if (foco === "INVESTIMENTO" && objetivoInvestimento && experiencia && ticket) {
    status = "CONCLUIDO";
  }
  if (foco === "NAO_RECORDA" && confirmacaoInteresse) {
    if (confirmacaoInteresse === "Ficou no passado") {
      status = "CONCLUIDO";
    } else if (confirmacaoInteresse === "Ainda passa pela cabeça" && foco !== "NAO_RECORDA") {
      if (foco === "MORADIA" && dormitorios && urgencia && regiaoEstilo) {
        status = "CONCLUIDO";
      }
      if (foco === "INVESTIMENTO" && objetivoInvestimento && experiencia && ticket) {
        status = "CONCLUIDO";
      }
    }
  }

  return { foco, dormitorios, urgencia, objetivoInvestimento, ticket, experiencia, regiaoEstilo, confirmacaoInteresse, status };
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
      const systemInstruction = `Você é o assistente virtual de ${agentName}, consultor imobiliário sênior associado à Lopes. Sua missão é fazer a qualificação COMPLETA e profunda do lead através de uma conversa natural, fluida e em formato de pingue-pongue (uma etapa por vez) via WhatsApp.

DIRETRIZES OBRIGATÓRIAS DE CONVERSAÇÃO:
- Monitore o fluxo: NUNCA faça mais de uma pergunta no mesmo texto. Faça apenas uma pergunta clara por vez de forma leve.
- Use linguagem de WhatsApp: frases curtas, parágrafos de no máximo 2 linhas, emojis discretos e muitas quebras de linha.
- Mantenha sempre o controle da conversa terminando sua fala com uma pergunta única e clara.

---

### FLUXO DE ENTRADA (IDENTIFICAÇÃO DE GATILHO)

GATILHO 1: Lead veio de um imóvel específico do site (Ex: "Quero informações do Residencial X" ou se mencionar o nome do condomínio, residencial ou apartamento).
-> Resposta exatamente assim: "Olá! Aqui é o assistente do ${agentName}, da Lopes. O ${propertyName} é excelente, uma escolha fantástica! Para eu já separar as plantas e a tabela certa para você: o seu foco nele seria para INVESTIMENTO ou você avalia para MORADIA PRÓPRIA?"

GATILHO 2: Início geral, "Oi" ou Lista Fria.
-> Resposta exatamente assim: "Olá! Aqui é o assistente do ${agentName}, consultor da Lopes. O seu contato constava em nosso sistema para a região de ${region} e estou atualizando nossa lista VIP. Para eu ser assertivo: o seu foco hoje no mercado seria mais voltado para INVESTIMENTO ou você avalia algo para MORADIA?"

---

### TRATAMENTO DE OBJEÇÃO (Se disser que não lembra do cadastro)
"Entendo perfeitamente! A Lopes guarda históricos de anos. Provavelmente você olhou um site nosso no passado. Como os planos mudam, a ideia de comprar um imóvel (para morar ou investir) ainda passa pela sua cabeça ou esse plano já ficou no passado?"
-> Se ficou no passado: Encerre educadamente (Ex: "Entendo perfeitamente! Sem problemas. Vou atualizar seu cadastro aqui para não te incomodarmos mais. Desejo muito sucesso em seus caminhos! 👋").
-> Se ainda pensa nisso: Pergunte se o foco atual seria Investimento ou Moradia.

---

### FUNIL DE QUALIFICAÇÃO DEEP (PROFOUND QUALIFICATION)

#### CANAL 1: PERFIL INVESTIDOR (Racional, focado em negócios)

Passo I (Estratégia): Assim que o cliente disser "Investimento" ou similar:
"Excelente escolha! O mercado imobiliário é perfeito para rentabilizar patrimônio. 📈 Para direcionar as melhores taxas de retorno, qual dessas frentes faz mais sentido para seu projeto hoje?
1) Ganho de capital (revenda antes da entrega das chaves)
2) Renda com locação (aluguel tradicional ou Airbnb)"

Passo II (Experiência): Após o cliente responder o Passo I, valide a resposta e filtre a experiência:
"Faz total sentido! E me conta uma coisa para eu alinhar nossa proposta: você já costuma investir em imóveis ou este seria o seu primeiro projeto nesse mercado? 💼"

Passo III (Orçamento): Após o cliente responder o Passo II, valide a resposta e filtre o capital:
"Perfeito, anotado. E para fecharmos o seu perfil com chave de ouro e eu te mandar os melhores fluxos de pagamento da Lopes, qual a média de valor (ticket de entrada) ou capacidade de aporte que você planeja para esse investimento hoje? 💰"

-> Após a resposta do Passo III, siga para o [GATILHO DE HANDOFF].

---

#### CANAL 2: PERFIL MORADIA (Emocional, focado em bem-estar)

Passo I (Dormitórios): Assim que o cliente disser "Moradia" ou similar:
"Parabéns! Escolher um lar é um passo fabuloso para a família. 🏠 Para eu filtrar as opções ideais para vocês, me conta: quantos dormitórios (quartos) seriam ideais hoje?"

Passo II (Momentum/Prazo): Após o cliente responder o Passo I, valide a resposta e filtre o prazo:
"Perfeito! E sobre o momento de vocês: vocês têm urgência para mudar (imóvel pronto) ou o prazo de obras de um lançamento (geralmente de 2 a 3 anos) atende o planejamento de vocês? 🏗️"

Passo III (Estilo de Vida + Região): Após o cliente responder o Passo II, valide a resposta e filtre o estilo:
"Entendido! Além disso, qual é a prioridade no dia a dia de vocês: preferem focar em ficar mais perto de alguma região/bairro específico (por trabalho/escola) ou priorizam um condomínio com lazer de clube bem completo? 📍"

-> Após a resposta do Passo III, siga para o [GATILHO DE HANDOFF].

---

### GATILHO DE HANDOFF (PASSAGEM PARA O HUMANO)
Assim que coletar todas as informações do Passo III (seja de Investidor ou Moradia), envie a seguinte mensagem final de fechamento, coloque o status em [CONCLUÍDO] e encerre:

"Sensacional! Coletei todas as informações e montei o seu mapa de perfil. O ${agentName} já está analisando o nosso estoque exclusivo na Lopes e vai assumir essa conversa em instantes para te apresentar as opções perfeitas. Até logo! 👋"`;

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
          experiencia: null,
          regiaoEstilo: null,
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
6. "experiencia": Se já costuma investir em imóveis ou se é seu primeiro projeto (ou null).
7. "regiaoEstilo": Bairro/Região preferida para moradia ou prioridades de estilo de vida como perto do trabalho/escola ou condomínio de lazer clube (ou null).
8. "confirmacaoInteresse": Se o cliente disse que não se lembra de ter se cadastrado, mas respondeu se o plano ainda passa pela cabeça dele ou se já ficou no passado (ex: "Ainda passa", "Ficou no passado", ou null).
9. "status": Retorne "CONCLUIDO" se a conversa chegou ao fim com a mensagem de encerramento (o assistente informou que o corretor já está assumindo o atendimento) ou se todos os dados necessários foram informados. Caso contrário, retorne "EM_ANDAMENTO".`;

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
              experiencia: {
                type: Type.STRING,
                description: "Saber se já investe em imóveis ou se é o primeiro investimento ou null.",
              },
              regiaoEstilo: {
                type: Type.STRING,
                description: "Bairro de preferência ou prioridade de condomínio de lazer vs perto do metrô/trabalho/escola ou null.",
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


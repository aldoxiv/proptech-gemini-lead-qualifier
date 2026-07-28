import React, { useState, useEffect, useRef } from "react";
import {
  RefreshCw,
  Download,
  Building2,
  Users,
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";
import { ChatMessage, LeadProfile } from "./types";
import LeadQualificationModule from "./components/LeadQualificationModule";
import ExpansionModule from "./components/ExpansionModule";

export default function App() {
  // Top level active module state: "LEAD_QUALIFICATION" or "EXPANSION_INCORPORADORA"
  const [activeModule, setActiveModule] = useState<
    "LEAD_QUALIFICATION" | "EXPANSION_INCORPORADORA"
  >(() => {
    try {
      const saved = localStorage.getItem("proptech_active_module");
      if (saved === "LEAD_QUALIFICATION" || saved === "EXPANSION_INCORPORADORA") {
        return saved;
      }
    } catch (e) {}
    return "EXPANSION_INCORPORADORA";
  });

  useEffect(() => {
    try {
      localStorage.setItem("proptech_active_module", activeModule);
    } catch (e) {}
  }, [activeModule]);

  // Config state for Lead Qualification simulator
  const [agentName, setAgentName] = useState<string>(() => {
    return localStorage.getItem("proptech_agent_name") || "Aldo Santos";
  });
  const [region, setRegion] = useState<string>(() => {
    return localStorage.getItem("proptech_region") || "São Paulo e Região";
  });
  const [propertyName, setPropertyName] = useState<string>(() => {
    return localStorage.getItem("proptech_property_name") || "Concept Jardins";
  });

  useEffect(() => {
    try {
      localStorage.setItem("proptech_agent_name", agentName);
      localStorage.setItem("proptech_region", region);
      localStorage.setItem("proptech_property_name", propertyName);
    } catch (e) {}
  }, [agentName, region, propertyName]);

  // Chat conversation state
  const [history, setHistory] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem("proptech_chat_history");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("proptech_chat_history", JSON.stringify(history));
    } catch (e) {}
  }, [history]);

  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Extracted lead profile state
  const [leadProfile, setLeadProfile] = useState<LeadProfile>({
    foco: null,
    dormitorios: null,
    urgencia: null,
    objetivoInvestimento: null,
    ticket: null,
    experiencia: null,
    regiaoEstilo: null,
    confirmacaoInteresse: null,
    status: "AGUARDANDO_INICIO"
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Presets configuration
  const handleApplyPreset = (preset: { agent: string; reg: string; prop: string }) => {
    setAgentName(preset.agent);
    setRegion(preset.reg);
    setPropertyName(preset.prop);
    handleReset();
  };

  const presets = [
    {
      name: "Sampa Alto Padrão",
      agent: "Aldo Santos",
      reg: "São Paulo e Região",
      prop: "Concept Jardins 🏢"
    },
    {
      name: "Litoral Sul VIP",
      agent: "Mariana Lopes",
      reg: "Santos e Baixada Santista",
      prop: "Residencial Mar Azul 🌊"
    },
    {
      name: "Rio Copacabana",
      agent: "Rodrigo Nobre",
      reg: "Zona Sul do Rio de Janeiro",
      prop: "Copacabana Premium Loft 🏖️"
    }
  ];

  // Auto scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isTyping]);

  // Sync / Analisar lead details on history updates
  useEffect(() => {
    if (history.length === 0) {
      setLeadProfile({
        foco: null,
        dormitorios: null,
        urgencia: null,
        objetivoInvestimento: null,
        ticket: null,
        experiencia: null,
        regiaoEstilo: null,
        confirmacaoInteresse: null,
        status: "AGUARDANDO_INICIO"
      });
      setIsAnalyzing(false);
      return;
    }

    setIsAnalyzing(true);

    const analyzeLead = async () => {
      try {
        const response = await fetch("/api/analyze-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history })
        });
        if (response.ok) {
          const data = await response.json();
          setLeadProfile((prev) => ({
            ...prev,
            ...data
          }));
        }
      } catch (err) {
        console.error("Falha ao analisar Lead:", err);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const timeout = setTimeout(analyzeLead, 500);
    return () => clearTimeout(timeout);
  }, [history]);

  // Handle sending a message to the Virtual Assistant
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend !== undefined ? textToSend : inputText;
    if (!text.trim() || isTyping) return;

    if (leadProfile.status === "CONCLUIDO") {
      setShowResetConfirm(true);
      return;
    }

    const updatedHistory: ChatMessage[] = [...history, { role: "user", text }];
    setHistory(updatedHistory);
    setInputText("");
    setIsTyping(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history,
          message: text,
          config: {
            agentName,
            propertyName,
            region
          }
        })
      });

      if (!response.ok) {
        throw new Error("Erro na comunicação com o servidor de IA.");
      }

      const data = await response.json();
      setHistory((prev) => [...prev, { role: "model", text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Não foi possível se comunicar com o corretor virtual.");
    } finally {
      setIsTyping(false);
    }
  };

  // Reset demo state
  const handleReset = () => {
    setHistory([]);
    setInputText("");
    setErrorMsg(null);
    setShowResetConfirm(false);
    setLeadProfile({
      foco: null,
      dormitorios: null,
      urgencia: null,
      objetivoInvestimento: null,
      ticket: null,
      experiencia: null,
      regiaoEstilo: null,
      confirmacaoInteresse: null,
      status: "AGUARDANDO_INICIO"
    });
  };

  // Preset triggers
  const triggerGatilho1 = () => {
    handleSendMessage(`Quero informações sobre o residencial ${propertyName}.`);
  };

  const triggerGatilho2 = () => {
    handleSendMessage("Oi, estou interessado em pesquisar um imóvel.");
  };

  const triggerGatilhoSpam = () => {
    handleSendMessage("Não lembro de ter me cadastrado nesse site.");
  };

  const isConcluido =
    leadProfile.status === "CONCLUIDO" ||
    history.some(
      (msg) => msg.role === "model" && msg.text.includes("está assumindo a conversa")
    );

  const hasPositiveStart = history.some(
    (msg) =>
      msg.role === "user" &&
      (msg.text.toLowerCase().includes("informações") ||
        msg.text.toLowerCase().includes("interessado") ||
        msg.text.toLowerCase().includes("moradia") ||
        msg.text.toLowerCase().includes("investimento") ||
        msg.text.toLowerCase().includes("morar") ||
        msg.text.toLowerCase().includes("investir"))
  );

  // Export lead TXT
  const downloadLeadTXT = () => {
    const textData = `
FICHA DE LEAD IMOBILIÁRIO - PROPTECH-IA VIP
===========================================
Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}
Corretor Responsável: ${agentName}
Imóvel de Interesse: ${propertyName}
Região Alvo: ${region}

DADOS QUALIFICADOS DO LEAD:
-------------------------------------------
- Classificação de Foco: ${leadProfile.foco || "Não definido"}
${
  leadProfile.foco === "MORADIA"
    ? `  * Dormitórios sugeridos: ${leadProfile.dormitorios || "A definir"}
  * Urgência de mudança: ${leadProfile.urgencia || "A definir"}
  * Região & Estilo de Vida: ${leadProfile.regiaoEstilo || "A definir"}`
    : ""
}
${
  leadProfile.foco === "INVESTIMENTO"
    ? `  * Objetivo estratégico: ${leadProfile.objetivoInvestimento || "A definir"}
  * Experiência em investimentos: ${leadProfile.experiencia || "A definir"}
  * Orçamento estimado (Ticket): ${leadProfile.ticket || "A definir"}`
    : ""
}
${
  leadProfile.foco === "NAO_RECORDA"
    ? `  * Confirmação de interesse futuro: ${leadProfile.confirmacaoInteresse || "Não respondeu"}`
    : ""
}

HISTÓRICO DO FUNIL:
-------------------------------------------
Status Atual: ${isConcluido ? "100% QUALIFICADO [MUDADO PARA HUMANO]" : "EM ATENDIMENTO AUTOMÁTICO"}
Total de Interações: ${history.length} mensagens

CONVERSA COMPLETA DA QUALIFICAÇÃO:
-------------------------------------------
${history.map((m) => `${m.role === "user" ? "CLIENTE" : "ASSISTENTE"}: ${m.text}`).join("\n\n")}
`;

    const blob = new Blob([textData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ficha-lead-${leadProfile.foco || "Geral"}-${agentName.replace(/\s+/g, "-")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col">
      {/* HEADER WITH PROPTECH-IA BRAND & DUAL-MODULE SWITCHER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white font-bold text-lg px-3.5 py-1.5 rounded-xl tracking-tight shadow-xs flex items-center gap-2 border border-slate-800">
              <Sparkles className="h-4.5 w-4.5 text-teal-400 fill-teal-400/20" />
              <span>proptech<span className="text-teal-400 font-extrabold">-IA</span></span>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                Plataforma de Inteligência Imobiliária
              </h1>
              <p className="text-xs text-slate-500">
                Soluções para Corretores (Vendas) & Incorporadoras (Expansão e Captação)
              </p>
            </div>
          </div>

          {/* Module Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full md:w-auto">
            <button
              onClick={() => setActiveModule("EXPANSION_INCORPORADORA")}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeModule === "EXPANSION_INCORPORADORA"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="h-4 w-4 text-red-500" />
              <span>Captação & Expansão (Incorporadoras)</span>
            </button>

            <button
              onClick={() => setActiveModule("LEAD_QUALIFICATION")}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeModule === "LEAD_QUALIFICATION"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="h-4 w-4 text-teal-400" />
              <span>Qualificação de Leads (Vendas)</span>
            </button>
          </div>

          {/* Actions for Lead Module */}
          {activeModule === "LEAD_QUALIFICATION" && (
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handleReset}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Limpar Conversa
              </button>
              <button
                onClick={downloadLeadTXT}
                disabled={history.length === 0}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  history.length === 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent"
                    : "bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                }`}
              >
                <Download className="h-3.5 w-3.5" />
                Exportar Lead
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeModule === "EXPANSION_INCORPORADORA" ? (
          <ExpansionModule />
        ) : (
          <LeadQualificationModule
            agentName={agentName}
            setAgentName={setAgentName}
            region={region}
            setRegion={setRegion}
            propertyName={propertyName}
            setPropertyName={setPropertyName}
            history={history}
            inputText={inputText}
            setInputText={setInputText}
            isTyping={isTyping}
            isAnalyzing={isAnalyzing}
            errorMsg={errorMsg}
            leadProfile={leadProfile}
            presets={presets}
            handleApplyPreset={handleApplyPreset}
            handleReset={handleReset}
            handleSendMessage={handleSendMessage}
            triggerGatilho1={triggerGatilho1}
            triggerGatilho2={triggerGatilho2}
            triggerGatilhoSpam={triggerGatilhoSpam}
            chatBottomRef={chatBottomRef}
            showResetConfirm={showResetConfirm}
            setShowResetConfirm={setShowResetConfirm}
            hasPositiveStart={hasPositiveStart}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>proptech-IA © {new Date().getFullYear()} — Plataforma de Inteligência Imobiliária</span>
          <span className="text-[11px] text-slate-400">
            Inteligência Artificial para Captação, Análise Regional, Due Diligence e Qualificação de Vendas
          </span>
        </div>
      </footer>
    </div>
  );
}

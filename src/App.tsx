import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Smartphone,
  User,
  MapPin,
  Building,
  CheckCircle,
  TrendingUp,
  Home,
  Sliders,
  AlertCircle,
  Trash2,
  HelpCircle,
  MoreVertical,
  Phone,
  Video,
  Download,
  RefreshCw,
  Info,
  LogOut
} from "lucide-react";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface LeadProfile {
  foco: "MORADIA" | "INVESTIMENTO" | "NAO_RECORDA" | null;
  dormitorios: string | null;
  urgencia: string | null;
  objetivoInvestimento: string | null;
  ticket: string | null;
  confirmacaoInteresse: string | null;
  status: "AGUARDANDO_INICIO" | "EM_ANDAMENTO" | "CONCLUIDO";
}

export default function App() {
  // Config state
  const [agentName, setAgentName] = useState<string>("Aldo Santos");
  const [region, setRegion] = useState<string>("São Paulo e Região");
  const [propertyName, setPropertyName] = useState<string>("Concept Jardins");

  // Chat conversation state
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Extracted lead profile state
  const [leadProfile, setLeadProfile] = useState<LeadProfile>({
    foco: null,
    dormitorios: null,
    urgencia: null,
    objetivoInvestimento: null,
    ticket: null,
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
        confirmacaoInteresse: null,
        status: "AGUARDANDO_INICIO"
      });
      return;
    }

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
      }
    };

    // Debounce analysis a bit to avoid excessive API requests
    const timeout = setTimeout(analyzeLead, 500);
    return () => clearTimeout(timeout);
  }, [history]);

  // Handle sending a message to the Virtual Assistant
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    // Prevent submitting after handoff is completed
    if (leadProfile.status === "CONCLUIDO") {
      setShowResetConfirm(true);
      return;
    }

    const updatedHistory: ChatMessage[] = [...history, { role: "user", text: textToSend }];
    setHistory(updatedHistory);
    setInputText("");
    setIsTyping(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history, // Send current history
          message: textToSend,
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
      setErrorMsg(err.message || "Não foi possível se comunicar com o corretor virtual. Verifique a chave de API.");
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

  const triggerNotRegistered = () => {
    handleSendMessage("Não lembro de ter me cadastrado nesse site.");
  };

  // Smart options selector to speed up testing
  const chatState = history.length;
  const isConcluido = leadProfile.status === "CONCLUIDO" || history.some((msg) => msg.role === 'model' && msg.text.includes("está assumindo a conversa"));

  // Calculate funnel percentage
  const getFunnelProgress = () => {
    if (history.length === 0) return 0;
    if (isConcluido) return 100;
    let progress = 20; // Started
    if (leadProfile.foco) progress += 30; // Chose moradia vs investimento
    if (leadProfile.dormitorios || leadProfile.objetivoInvestimento) progress += 25; // Answered first level details
    if (leadProfile.urgencia || leadProfile.ticket || leadProfile.confirmacaoInteresse) progress += 25; // Answered final details
    return Math.min(progress, 95);
  };

  const progressPercent = getFunnelProgress();

  // Export lead profiles
  const downloadLeadTXT = () => {
    const textData = `
FICHA DE LEAD IMOBILIÁRIO - LOPES CONEXÃO VIP
===========================================
Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}
Corretor Responsável: ${agentName}
Imóvel de Interesse: ${propertyName}
Região Alvo: ${region}

DADOS QUALIFICADOS DO LEAD:
-------------------------------------------
- Classificação de Foco: ${leadProfile.foco || "Não definido"}
${leadProfile.foco === "MORADIA" ? `  * Dormitórios sugeridos: ${leadProfile.dormitorios || "A definir"}
  * Urgência de mudança: ${leadProfile.urgencia || "A definir"}` : ""}
${leadProfile.foco === "INVESTIMENTO" ? `  * Objetivo estratégico: ${leadProfile.objetivoInvestimento || "A definir"}
  * Orçamento estimado (Ticket): ${leadProfile.ticket || "A definir"}` : ""}
${leadProfile.foco === "NAO_RECORDA" ? `  * Confirmação de interesse futuro: ${leadProfile.confirmacaoInteresse || "Não respondeu"}` : ""}

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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      
      {/* Upper header with Lopes Brand visual style */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Minimalist Lopes Branding Red Box */}
            <div className="bg-[#E30613] text-white font-display font-black text-2xl px-3 py-1 rounded tracking-tighter">
              lopes
            </div>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <div>
              <h1 className="text-lg font-bold font-display text-slate-900 tracking-tight flex items-center gap-1.5">
                Simulador Inteligente: Qualificador VIP de Leads
              </h1>
              <p className="text-xs text-slate-500">
                Assistente Virtual do Corretor de Imóveis • Lopes Conexão Rápida
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={handleReset}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition"
              id="btn-reset"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Limpar Conversa
            </button>
            <button
              onClick={downloadLeadTXT}
              disabled={history.length === 0}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                history.length === 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent"
                  : "bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
              }`}
              id="btn-download"
            >
              <Download className="h-3.5 w-3.5" />
              Exportar Lead
            </button>
          </div>
        </div>
      </header>

      {/* Main content split dashboard layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Controls & Configurations (4 cols on lg) */}
        <section className="lg:col-span-3 flex flex-col gap-6" id="configs-panel">
          
          {/* Box 1: Assistant Identity */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="h-5 w-5 text-red-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Configurar Corretor
              </h2>
            </div>

            {/* Presets Grid */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-500 mb-2">
                Carregar Preset de Teste:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleApplyPreset(preset)}
                    className={`text-left text-xs p-2.5 rounded-lg border transition ${
                      agentName === preset.agent
                        ? "bg-red-50/50 border-red-200 text-red-700 font-medium"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  >
                    <span className="block font-bold mb-0.5">{preset.name}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {preset.agent} • {preset.prop}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Config Fields */}
            <hr className="border-slate-100 my-4" />

            <div className="space-y-4">
              <div>
                <label htmlFor="agent-name-input" className="block text-xs font-semibold text-slate-600 mb-1">
                  Nome do Consultor (Seu Nome)
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    id="agent-name-input"
                    type="text"
                    onChange={(e) => setAgentName(e.target.value)}
                    value={agentName}
                    placeholder="Ex: Aldo Santos"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="region-input" className="block text-xs font-semibold text-slate-600 mb-1">
                  Sua Cidade/Região Alvo
                </label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    id="region-input"
                    type="text"
                    onChange={(e) => setRegion(e.target.value)}
                    value={region}
                    placeholder="Ex: Recife e Região"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="property-input" className="block text-xs font-semibold text-slate-600 mb-1">
                  Imóvel de Interesse (Gatilho 1)
                </label>
                <div className="relative">
                  <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    id="property-input"
                    type="text"
                    onChange={(e) => setPropertyName(e.target.value)}
                    value={propertyName}
                    placeholder="Ex: Concept Jardins"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Guide Tips */}
          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
              <HelpCircle className="h-4 w-4 text-slate-500" />
              Guia de Simulação Lopes:
            </h3>
            <ul className="text-[11px] text-slate-600 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                Inicie clicando em um dos <strong>Gatilhos Rápidos</strong> no topo do celular para carregar a abordagem certa.
              </li>
              <li>
                O bot detecta se a intenção é <strong>Moradia</strong> ou <strong>Investimento</strong> e troca as perguntas automaticamente.
              </li>
              <li>
                Caso simule uma <strong>recusa por spam</strong> (Não recorda de cadastro), o bot entra em modo de desarmamento empático.
              </li>
              <li>
                Uma vez captados os dados vitais, o bot anuncia a entrada de <strong className="text-red-600">{agentName}</strong> e finaliza o atendimento.
              </li>
            </ul>
          </div>
        </section>

        {/* MIDDLE COLUMN: WhatsApp Simulation Device (5 cols on lg) */}
        <section className="lg:col-span-5 flex flex-col items-center" id="simulator-panel">
          
          {/* Smart Phone Container */}
          <div className="w-full max-w-[390px] aspect-[9/18] bg-black rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col relative overflow-hidden">
            
            {/* Phone Notch/Speaker */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50 flex items-center justify-center">
              <div className="w-12 h-1 bg-neutral-800 rounded-full mb-1"></div>
            </div>

            {/* Screen Area */}
            <div className="flex-1 bg-[#efeae2] rounded-[30px] overflow-hidden flex flex-col relative border border-slate-900">
              
              {/* Phone Status bar */}
              <div className="bg-[#128C7E] text-white pt-5 pb-1 px-5 flex justify-between items-center text-[10px]">
                <span className="font-semibold select-none">12:36 💬</span>
                <div className="flex items-center gap-1 select-none">
                  <span>📶</span>
                  <span>🔋 98%</span>
                </div>
              </div>

              {/* WhatsApp Header */}
              <div className="bg-[#128C7E] text-white px-3 py-2 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 bg-teal-100 rounded-full flex items-center justify-center text-teal-800 font-bold border border-white/20 relative shadow-inner">
                    💬
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold leading-tight">
                      Lopes VIP • Assistente
                    </h3>
                    <p className="text-[9px] text-teal-100">
                      {isTyping ? "digitando..." : "Assistente Virtual Ativo"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-white">
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="bg-red-600/90 hover:bg-red-700 font-bold text-[9px] uppercase tracking-wider px-2 py-1 rounded transition flex items-center gap-0.5 shadow-xs"
                    title="Sair"
                  >
                    <span>Sair 🚪</span>
                  </button>
                  <MoreVertical className="h-4 w-4 select-none opacity-85" />
                </div>
              </div>

              {/* Encryption Notice */}
              <div className="bg-amber-100/80 border border-amber-200/50 mx-4 mt-2 p-1.5 rounded-lg text-center text-[9px] text-amber-900/80 leading-normal flex items-start gap-1 justify-center">
                <Info className="h-3 w-3 shrink-0 text-amber-700 mt-0.5" />
                <span>As mensagens são criptografadas de ponta a ponta. Simulador de Qualificação Lopes ativo.</span>
              </div>

              {/* Message Feed Area */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 wa-bg flex flex-col">
                {history.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 select-none">
                    <div className="bg-teal-50 text-teal-800 p-4 rounded-full mb-3 shadow-xs border border-teal-100 animate-bounce">
                      <MessageSquare className="h-8 w-8" />
                    </div>
                    <span className="text-slate-800 text-xs font-semibold bg-white/90 px-3 py-1.5 rounded-full shadow-xs border border-slate-200">
                      Aguardando mensagem inicial...
                    </span>
                    <p className="text-[11px] text-slate-500 mt-2 max-w-[240px]">
                      Use um dos botões de gatilho rápido abaixo ou digite um &quot;Oi&quot; no campo de texto para iniciar a qualificação Lopes.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="self-center bg-white/70 backdrop-blur-xs text-slate-500 text-[10px] px-2 py-0.5 rounded shadow-xs mb-2">
                      HOJE
                    </div>

                    {history.map((msg, index) => {
                      const isUser = msg.role === "user";
                      return (
                        <div
                          key={index}
                          className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed shadow-xs ${
                            isUser
                              ? "self-end bg-[#d9fdd3] text-slate-900 border-b border-green-200"
                              : "self-start bg-white text-slate-900"
                          }`}
                        >
                          {/* Markdown Linebreaks replacement parsing */}
                          <div className="whitespace-pre-line text-[11.5px]">{msg.text}</div>
                          <div className="text-[8.5px] text-right text-slate-400 mt-1">
                            12:36 {isUser && <span className="text-blue-500 ml-0.5">✓✓</span>}
                          </div>
                        </div>
                      );
                    })}

                    {/* Chatbot typing simulator */}
                    {isTyping && (
                      <div className="self-start bg-white rounded-lg px-4 py-2.5 text-xs shadow-xs flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    )}
                  </>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Gatilhos Quick Controls - Inside Mobile Screen to give optimal UI touch targets */}
              {history.length === 0 && (
                <div className="p-2.5 bg-white border-t border-slate-100 flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block px-1">
                    Gatilhos de Entrada do Cliente:
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    <button
                      onClick={triggerGatilho1}
                      className="text-left text-[11px] p-2 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg text-slate-700 font-medium transition flex items-center justify-between"
                      id="btn-gate-1"
                    >
                      <span>1. Interesse no Imóvel ({propertyName})</span>
                      <span className="text-red-500 text-[10px]">Gat. 1 🏢</span>
                    </button>
                    <button
                      onClick={triggerGatilho2}
                      className="text-left text-[11px] p-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-lg text-slate-700 font-medium transition flex items-center justify-between"
                      id="btn-gate-2"
                    >
                      <span>2. Enviar &quot;Oi&quot; / Lista Fria</span>
                      <span className="text-teal-600 text-[10px]">Gat. 2 💬</span>
                    </button>
                    <button
                      onClick={triggerNotRegistered}
                      className="text-left text-[11px] p-2 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-lg text-slate-700 font-medium transition flex items-center justify-between"
                      id="btn-gate-3"
                    >
                      <span>3. &quot;Não lembro de me cadastrar&quot;</span>
                      <span className="text-amber-600 text-[10px]">Desarme ⚠️</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Contextual fast-suggestion replies based on chat state */}
              {history.length > 0 && !isTyping && !isConcluido && (
                <div className="px-3 py-2.5 bg-white border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      💡 Escolha uma das opções abaixo:
                    </span>
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="text-[10px] text-red-500 font-bold hover:underline flex items-center gap-1 transition"
                    >
                      🚪 Encerrar Conversa (Sair)
                    </button>
                  </div>
                  <div className="flex gap-2 pb-1 overflow-x-auto select-none snap-x snap-mandatory">
                    {/* Suggest standard answers based on what standard questions are being expected */}
                    {leadProfile.foco === null && (
                      <>
                        <button
                          onClick={() => handleSendMessage("Quero MORADIA")}
                          className="text-[11px] px-3.5 py-2 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg font-bold hover:bg-teal-100 transition active:scale-95 shrink-0 snap-center flex items-center gap-1.5"
                        >
                          🏠 Moradia Própria
                        </button>
                        <button
                          onClick={() => handleSendMessage("Quero INVESTIMENTO")}
                          className="text-[11px] px-3.5 py-2 bg-red-50 border border-red-200 text-red-800 rounded-lg font-bold hover:bg-red-100 transition active:scale-95 shrink-0 snap-center flex items-center gap-1.5"
                        >
                          📈 Investimento
                        </button>
                      </>
                    )}

                    {leadProfile.foco === "MORADIA" && !leadProfile.dormitorios && (
                      <>
                        <button
                          onClick={() => handleSendMessage("Preciso de 2 dormitórios")}
                          className="text-[11px] px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg font-bold hover:bg-slate-200 transition shrink-0 snap-center flex items-center gap-1.5"
                        >
                          🛏️ 2 Dormitórios
                        </button>
                        <button
                          onClick={() => handleSendMessage("Precisamos de pelo menos 3 dormitórios")}
                          className="text-[11px] px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg font-bold hover:bg-slate-200 transition shrink-0 snap-center flex items-center gap-1.5"
                        >
                          🛏️ 3+ Dormitórios
                        </button>
                      </>
                    )}

                    {leadProfile.foco === "MORADIA" && leadProfile.dormitorios && !leadProfile.urgencia && (
                      <>
                        <button
                          onClick={() => handleSendMessage("Temos urgência para mudar de imediato")}
                          className="text-[11px] px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg font-bold hover:bg-slate-200 transition shrink-0 snap-center flex items-center gap-1.5"
                        >
                          🔑 Urgência Imediata
                        </button>
                        <button
                          onClick={() => handleSendMessage("Temos prazo de obras, lançamento nos atende bem")}
                          className="text-[11px] px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg font-bold hover:bg-slate-200 transition shrink-0 snap-center flex items-center gap-1.5"
                        >
                          🏗️ Prazo de Obras (2-3 anos)
                        </button>
                      </>
                    )}

                    {leadProfile.foco === "INVESTIMENTO" && !leadProfile.objetivoInvestimento && (
                      <>
                        <button
                          onClick={() => handleSendMessage("1) Ganho de capital")}
                          className="text-[11px] px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg font-bold hover:bg-slate-200 transition shrink-0 snap-center flex items-center gap-1.5"
                        >
                          💸 Ganho de Capital
                        </button>
                        <button
                          onClick={() => handleSendMessage("2) Renda passiva com aluguel")}
                          className="text-[11px] px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg font-bold hover:bg-slate-200 transition shrink-0 snap-center flex items-center gap-1.5"
                        >
                          💰 Renda / Aluguel
                        </button>
                      </>
                    )}

                    {leadProfile.foco === "INVESTIMENTO" && leadProfile.objetivoInvestimento && !leadProfile.ticket && (
                      <>
                        <button
                          onClick={() => handleSendMessage("Pretendo planejar em torno de R$ 500 mil")}
                          className="text-[11px] px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg font-bold hover:bg-slate-200 transition shrink-0 snap-center flex items-center gap-1.5"
                        >
                          💵 Até R$ 500k
                        </button>
                        <button
                          onClick={() => handleSendMessage("Planejamos de R$ 800 mil a R$ 1.5 milhão")}
                          className="text-[11px] px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg font-bold hover:bg-slate-200 transition shrink-0 snap-center flex items-center gap-1.5"
                        >
                          💎 R$ 800k - R$ 1.5M
                        </button>
                      </>
                    )}

                    {leadProfile.foco === "NAO_RECORDA" && (
                      <>
                        <button
                          onClick={() => handleSendMessage("Sim, ainda de certa forma penso em comprar um imóvel.")}
                          className="text-[11px] px-3.5 py-2 bg-green-50 border border-green-200 text-green-800 rounded-lg font-bold hover:bg-green-100 transition shrink-0 snap-center flex items-center gap-1.5"
                        >
                          👍 Ainda considero comprar
                        </button>
                        <button
                          onClick={() => handleSendMessage("Não, esse plano já ficou totalmente para o passado.")}
                          className="text-[11px] px-3.5 py-2 bg-red-50 border border-red-200 text-red-00 rounded-lg font-bold hover:bg-red-100 transition shrink-0 snap-center flex items-center gap-1.5"
                        >
                          🛑 Ficou no passado
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Message Composer Footer */}
              <div className="bg-slate-100 p-2 border-t border-slate-200 flex items-center justify-between gap-1.5 relative">
                {isConcluido && (
                  <div className="absolute inset-0 bg-slate-900/95 flex items-center justify-center text-center p-2 z-10 transition">
                    <span className="text-[10px] text-green-400 font-bold tracking-wider uppercase flex items-center gap-1 animate-pulse">
                      <CheckCircle className="h-3.5 w-3.5" /> Atendimento assumido por {agentName}!
                    </span>
                  </div>
                )}

                <div className="flex-1 bg-white rounded-full px-3 py-1.5 flex items-center shadow-xs border border-slate-200">
                  <input
                    type="text"
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
                    value={inputText}
                    placeholder={isConcluido ? "Handoff VIP Realizado" : "Digite sua mensagem..."}
                    className="flex-1 text-xs outline-hidden text-slate-800"
                    disabled={isConcluido}
                    id="chat-input"
                  />
                </div>
                <button
                  onClick={() => handleSendMessage(inputText)}
                  disabled={isConcluido || !inputText.trim() || isTyping}
                  className={`p-2 bg-[#128C7E] text-white rounded-full hover:bg-teal-700 transition active:scale-95 flex items-center justify-center shadow-xs ${
                    isConcluido || !inputText.trim() || isTyping ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                  id="btn-send-message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Custom Reset Confirmation Modal overlay */}
              {showResetConfirm && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-[100] animate-fade-in">
                  <div className="bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 max-w-[280px] w-full text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                      <LogOut className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-950 uppercase tracking-widest">
                        Encerrar Conversa?
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Isso reiniciará todo o histórico e a qualificação do lead do início.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleReset}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition duration-150"
                      >
                        Sim, Sair e Reiniciar
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition duration-150"
                      >
                        Não, Continuar Conversa
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Show server connection errors gracefully */}
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700 flex items-start gap-2 shadow-xs max-w-[370px]">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Falha no Assistente Gemini:</p>
                <p className="text-[10px] opacity-90 leading-tight mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

        </section>

        {/* RIGHT COLUMN: Real-Time Lead Analytics Dashboard (4 cols on lg) */}
        <section className="lg:col-span-4 flex flex-col gap-6" id="dashboard-panel">
          
          {/* Funnel Progress Tracker */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Progresso do Funil Lopes
            </h2>
            <div className="flex justify-between items-center text-xs text-slate-800 font-bold mb-1.5">
              <span>Etapa de Qualificação</span>
              <span className="text-red-600">{progressPercent}%</span>
            </div>
            
            {/* Dynamic Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <div
                className="h-full bg-linear-to-r from-teal-500 to-red-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 text-[9px] text-slate-400 font-semibold mt-1.5 text-center">
              <span className="text-left select-none">1. Abordagem</span>
              <span className="select-none">2. Sondagem</span>
              <span className="text-right select-none">3. Handoff</span>
            </div>
          </div>

          {/* Captured Profile Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Perfil Extraído do Lead
                  </h3>
                </div>
                {/* Active classification micro badge */}
                {leadProfile.foco ? (
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    leadProfile.foco === 'MORADIA' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                    leadProfile.foco === 'INVESTIMENTO' ? 'bg-red-50 text-red-700 border border-red-100' :
                    'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {leadProfile.foco}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 bg-slate-100 font-bold tracking-wider px-2 py-0.5 rounded-full">
                    Sondando...
                  </span>
                )}
              </div>

              {/* Data Properties List */}
              <div className="space-y-4">
                
                {/* 1. FOCO */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500 mt-0.5">
                    {leadProfile.foco === "MORADIA" ? (
                      <Home className="h-4 w-4 text-teal-600" />
                    ) : leadProfile.foco === "INVESTIMENTO" ? (
                      <TrendingUp className="h-4 w-4 text-red-600" />
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Foco Primário
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {leadProfile.foco === "MORADIA" ? "Moradia Própria (Qualidade de Vida)" :
                       leadProfile.foco === "INVESTIMENTO" ? "Investimento Imobiliário (ROI)" :
                       leadProfile.foco === "NAO_RECORDA" ? "Não recorda de ter cadastrado" :
                       "Aguardando o cliente responder..."}
                    </span>
                  </div>
                </div>

                {/* Conditional Fields: MORADIA */}
                {(!leadProfile.foco || leadProfile.foco === "MORADIA") && (
                  <>
                    {/* Dormitorios */}
                    <div className="flex items-start gap-3 pl-2 border-l-2 border-teal-500/30">
                      <div className="text-[14px] mt-0.5">🛏️</div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Dormitórios Solicitados
                        </span>
                        <span className={`text-xs font-semibold ${leadProfile.dormitorios ? "text-teal-900" : "text-slate-400"}`}>
                          {leadProfile.dormitorios || "Aguardando resposta..."}
                        </span>
                      </div>
                    </div>

                    {/* Urgência */}
                    <div className="flex items-start gap-3 pl-2 border-l-2 border-teal-500/30">
                      <div className="text-[14px] mt-0.5">📅</div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Prazo / Urgência
                        </span>
                        <span className={`text-xs font-semibold ${leadProfile.urgencia ? "text-teal-900" : "text-slate-400"}`}>
                          {leadProfile.urgencia || "Aguardando resposta..."}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Conditional Fields: INVESTIMENTO */}
                {(!leadProfile.foco || leadProfile.foco === "INVESTIMENTO") && (
                  <>
                    {/* Objetivo */}
                    <div className="flex items-start gap-3 pl-2 border-l-2 border-red-500/30">
                      <div className="text-[14px] mt-0.5">🎯</div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Objetivo Estratégico
                        </span>
                        <span className={`text-xs font-semibold ${leadProfile.objetivoInvestimento ? "text-red-900" : "text-slate-400"}`}>
                          {leadProfile.objetivoInvestimento || "Aguardando resposta..."}
                        </span>
                      </div>
                    </div>

                    {/* Ticket */}
                    <div className="flex items-start gap-3 pl-2 border-l-2 border-red-500/30">
                      <div className="text-[14px] mt-0.5">💰</div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Orçamento Planejado (Ticket)
                        </span>
                        <span className={`text-xs font-semibold ${leadProfile.ticket ? "text-red-900" : "text-slate-400"}`}>
                          {leadProfile.ticket || "Aguardando resposta..."}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Conditional Fields: NAO RECORDA CADASTRO */}
                {leadProfile.foco === "NAO_RECORDA" && (
                  <div className="flex items-start gap-3 pl-2 border-l-2 border-amber-500/30">
                    <div className="text-[14px] mt-0.5">🔍</div>
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        Interesse após desarmamento
                      </span>
                      <span className={`text-xs font-semibold ${leadProfile.confirmacaoInteresse ? "text-amber-900" : "text-slate-400"}`}>
                        {leadProfile.confirmacaoInteresse || "Aguardando resposta..."}
                      </span>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Glowing VIP Handoff Notification Card */}
            {isConcluido && (
              <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-500 rounded-xl p-4 shadow-md animate-pulse-slow">
                <div className="flex items-center gap-2 text-green-800 font-bold text-xs uppercase mb-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  Atendimento Concluído!
                </div>
                <p className="text-[11px] text-green-900 leading-relaxed font-medium">
                  Status: <strong>[CONCLUÍDO]</strong>
                </p>
                <p className="text-[11px] text-slate-700 leading-relaxed mt-1">
                  O lead foi qualificado e desarmado com sucesso. O contato foi movido para a Carteira VIP de <strong className="text-red-600">{agentName}</strong> na Lopes. O corretor assumiu o visor humano!
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={downloadLeadTXT}
                    className="flex-1 py-1.5 px-3 bg-green-600 text-white rounded-lg text-[10px] font-bold shadow-xs hover:bg-green-700 transition"
                  >
                    Salvar Dados (.TXT)
                  </button>
                  <button
                    onClick={handleReset}
                    className="py-1.5 px-3 bg-white border border-green-300 text-green-800 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition"
                  >
                    Simular Outro
                  </button>
                </div>
              </div>
            )}

            {!isConcluido && history.length > 0 && (
              <div className="mt-6 bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-800 leading-relaxed">
                <span className="font-bold uppercase tracking-wider block text-[9px] text-blue-500 mb-1">
                  💡 Status do Assistente:
                </span>
                Qualificação ativa. O robô está extraindo em tempo real as respostas estratégicas de forma empática no padrão Lopes VIP.
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Real estate footer branding */}
      <footer className="bg-slate-900 text-slate-400 py-6 mt-auto text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 select-none">
            <div className="bg-[#E30613] text-white font-bold px-2 py-0.5 rounded text-sm tracking-tighter">
              lopes
            </div>
            <span>© 2026 Lopes Imobiliária S.A. Todos os direitos reservados.</span>
          </div>
          <div className="flex gap-4">
            <span className="text-slate-500">Creci J-10293</span>
            <span className="text-slate-500">Tecnologia Conectada Gemini-3.5-Flash</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

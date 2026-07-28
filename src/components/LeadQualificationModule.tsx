import React from "react";
import {
  MessageSquare,
  Send,
  User,
  MapPin,
  Building,
  CheckCircle,
  TrendingUp,
  Home,
  AlertCircle,
  MoreVertical,
  Info,
  RefreshCw,
  LogOut,
  Sparkles
} from "lucide-react";
import { ChatMessage, LeadProfile } from "../types";

interface LeadQualificationModuleProps {
  agentName: string;
  setAgentName: (val: string) => void;
  region: string;
  setRegion: (val: string) => void;
  propertyName: string;
  setPropertyName: (val: string) => void;
  history: ChatMessage[];
  inputText: string;
  setInputText: (val: string) => void;
  isTyping: boolean;
  isAnalyzing: boolean;
  errorMsg: string | null;
  leadProfile: LeadProfile;
  presets: { name: string; agent: string; reg: string; prop: string }[];
  handleApplyPreset: (preset: { agent: string; reg: string; prop: string }) => void;
  handleReset: () => void;
  handleSendMessage: (textToSend?: string) => void;
  triggerGatilho1: () => void;
  triggerGatilho2: () => void;
  triggerGatilhoSpam: () => void;
  chatBottomRef: React.RefObject<HTMLDivElement | null>;
  showResetConfirm: boolean;
  setShowResetConfirm: (val: boolean) => void;
  hasPositiveStart: boolean;
}

export default function LeadQualificationModule({
  agentName,
  setAgentName,
  region,
  setRegion,
  propertyName,
  setPropertyName,
  history,
  inputText,
  setInputText,
  isTyping,
  isAnalyzing,
  errorMsg,
  leadProfile,
  presets,
  handleApplyPreset,
  handleReset,
  handleSendMessage,
  triggerGatilho1,
  triggerGatilho2,
  triggerGatilhoSpam,
  chatBottomRef,
  showResetConfirm,
  setShowResetConfirm,
  hasPositiveStart,
}: LeadQualificationModuleProps) {
  const isConcluido =
    leadProfile.status === "CONCLUIDO" ||
    history.some(
      (msg) =>
        msg.role === "model" &&
        msg.text.includes("está assumindo a conversa")
    );

  const getFunnelProgress = () => {
    if (history.length === 0) return 0;
    let fieldsCount = 0;
    if (leadProfile.foco) fieldsCount++;
    if (leadProfile.dormitorios) fieldsCount++;
    if (leadProfile.urgencia) fieldsCount++;
    if (leadProfile.objetivoInvestimento) fieldsCount++;
    if (leadProfile.ticket) fieldsCount++;
    if (leadProfile.experiencia) fieldsCount++;
    if (leadProfile.regiaoEstilo) fieldsCount++;
    if (leadProfile.confirmacaoInteresse) fieldsCount++;

    if (isConcluido) return 100;
    return Math.min(90, Math.max(15, fieldsCount * 20));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN: Configuration & Info Panel (3 cols on lg) */}
      <section className="lg:col-span-3 space-y-5" id="config-panel">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 bg-red-100 text-red-600 rounded-lg">⚙️</span>
              Configurações do Robô
            </h2>
            <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-teal-200">
              Corretor proptech-IA
            </span>
          </div>

          {/* Quick Presets Selector */}
          <div className="mb-4">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Presets Rápidos de Empreendimento:
            </label>
            <div className="flex flex-col gap-1.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(preset)}
                  className={`text-left text-xs p-2 rounded-xl border transition flex items-center justify-between ${
                    propertyName === preset.prop
                      ? "bg-red-50 border-red-300 text-red-900 font-bold"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="truncate">{preset.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal shrink-0">
                    {preset.agent.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nome do Corretor / Responsável:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-slate-800 font-medium"
                />
                <User className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Região / Praça de Atuação:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-slate-800 font-medium"
                />
                <MapPin className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Empreendimento em Destaque:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-slate-800 font-medium"
                />
                <Building className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Box */}
        <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl shadow-xs border border-slate-800 text-xs leading-relaxed space-y-2">
          <h3 className="font-bold text-white flex items-center gap-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            Como utilizar este Simulador:
          </h3>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-[11px]">
            <li>
              Inicie clicando em um dos <strong>Gatilhos Rápidos</strong> no topo do celular.
            </li>
            <li>
              O bot detecta se a intenção é <strong>Moradia</strong> ou <strong>Investimento</strong>.
            </li>
            <li>
              Caso simule uma <strong>recusa por spam</strong> (Não recorda), o bot desarma empaticamente.
            </li>
            <li>
              Ao captar os dados vitais, o bot passa a bola para <strong className="text-red-400">{agentName}</strong>.
            </li>
          </ul>
        </div>
      </section>

      {/* MIDDLE COLUMN: WhatsApp Simulation Device (5 cols on lg) */}
      <section className="lg:col-span-5 flex flex-col items-center" id="simulator-panel">
        <div className="w-full max-w-[390px] h-[660px] max-h-[82vh] bg-black rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col relative overflow-hidden shrink-0">
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
                    proptech-IA • Assistente
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
              <span>As mensagens são criptografadas. Simulador proptech-IA ativo.</span>
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
                    Use um dos botões de gatilho rápido abaixo para iniciar a qualificação.
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
                        <div className="whitespace-pre-line text-[11.5px]">{msg.text}</div>
                        <div className="text-[8.5px] text-right text-slate-400 mt-1">
                          12:36 {isUser && <span className="text-blue-500 ml-0.5">✓✓</span>}
                        </div>
                      </div>
                    );
                  })}

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

            {/* Gatilhos Quick Controls */}
            {history.length === 0 && (
              <div className="p-2.5 bg-white border-t border-slate-100 flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block px-1">
                  Gatilhos de Entrada do Cliente:
                </span>
                <div className="grid grid-cols-1 gap-1">
                  <button
                    onClick={triggerGatilho1}
                    className="text-left text-[11px] p-2 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg text-slate-700 font-medium transition flex items-center justify-between"
                  >
                    <span>1. Interesse no Imóvel ({propertyName})</span>
                    <span className="text-red-500 text-[10px]">Gat. 1 🏢</span>
                  </button>
                  <button
                    onClick={triggerGatilho2}
                    className="text-left text-[11px] p-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-lg text-slate-700 font-medium transition flex items-center justify-between"
                  >
                    <span>2. Enviar &quot;Oi&quot; / Lista Fria</span>
                    <span className="text-teal-600 text-[10px]">Gat. 2 💬</span>
                  </button>
                  <button
                    onClick={triggerGatilhoSpam}
                    className="text-left text-[11px] p-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-amber-900 font-medium transition flex items-center justify-between"
                  >
                    <span>3. Recusa: &quot;Não lembro de me cadastrar&quot;</span>
                    <span className="text-amber-700 text-[10px]">Gat. 3 ⚠️</span>
                  </button>
                </div>
              </div>
            )}

            {/* Contextual fast-suggestion replies */}
            {history.length > 0 && !isTyping && !isConcluido && (
              <div className="px-3 py-2.5 bg-white border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Sugestões de Resposta do Cliente:
                  </span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {leadProfile.foco === null && (
                    <>
                      <button
                        onClick={() => handleSendMessage("Quero para Moradia")}
                        className="text-[11px] px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg font-bold hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition active:scale-95 shrink-0 snap-center flex items-center gap-1.5"
                      >
                        🏠 Moradia
                      </button>
                      <button
                        onClick={() => handleSendMessage("Tenho interesse em Investimento")}
                        className="text-[11px] px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg font-bold hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800 transition active:scale-95 shrink-0 snap-center flex items-center gap-1.5"
                      >
                        📈 Investimento
                      </button>
                      {!hasPositiveStart && (
                        <button
                          onClick={() => handleSendMessage("Não lembro de ter me cadastrado")}
                          className="text-[11px] px-3.5 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg font-bold hover:bg-amber-100 transition active:scale-95 shrink-0 snap-center flex items-center gap-1.5"
                        >
                          🔍 Não lembro de me cadastrar
                        </button>
                      )}
                    </>
                  )}

                  {leadProfile.foco === "MORADIA" && leadProfile.dormitorios === null && (
                    <>
                      <button
                        onClick={() => handleSendMessage("Preciso de 2 dormitórios")}
                        className="text-[11px] px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-200 transition shrink-0"
                      >
                        2 Dormitórios
                      </button>
                      <button
                        onClick={() => handleSendMessage("Procuro 3 dormitórios ou mais")}
                        className="text-[11px] px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-200 transition shrink-0"
                      >
                        3+ Dormitórios
                      </button>
                    </>
                  )}

                  {leadProfile.foco === "INVESTIMENTO" && leadProfile.objetivoInvestimento === null && (
                    <>
                      <button
                        onClick={() => handleSendMessage("Busco renda passiva com aluguel / Airbnb")}
                        className="text-[11px] px-3.5 py-2 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg font-semibold hover:bg-teal-100 transition shrink-0"
                      >
                        🔑 Renda (Aluguel/Airbnb)
                      </button>
                      <button
                        onClick={() => handleSendMessage("Quero ganho de capital na revenda")}
                        className="text-[11px] px-3.5 py-2 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg font-semibold hover:bg-teal-100 transition shrink-0"
                      >
                        💰 Ganho de Capital
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-2 bg-[#f0f2f5] border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isTyping || isConcluido}
                placeholder={
                  isConcluido
                    ? "Qualificação concluída!"
                    : "Simular resposta do cliente..."
                }
                className="flex-1 bg-white text-xs px-3.5 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100 text-slate-800 font-medium"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping || isConcluido}
                className="h-8 w-8 bg-[#128C7E] hover:bg-teal-700 text-white rounded-full flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-xs"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Reset / Clear Chat Button */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reiniciar Simulador
          </button>
        </div>
      </section>

      {/* RIGHT COLUMN: Real-Time Lead Extraction & Profile Panel (4 cols on lg) */}
      <section className="lg:col-span-4 space-y-5" id="lead-panel">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="p-1.5 bg-teal-100 text-teal-800 rounded-lg">📊</span>
                Perfil Extraído em Tempo Real
              </h2>
              <p className="text-[11px] text-slate-500">
                IA analisa e preenche o CRM instantaneamente
              </p>
            </div>
            {isAnalyzing && (
              <span className="flex items-center gap-1 text-[10px] text-teal-600 bg-teal-50 px-2 py-1 rounded-full font-bold animate-pulse border border-teal-200">
                <RefreshCw className="h-3 w-3 animate-spin" /> IA Extraindo...
              </span>
            )}
          </div>

          {/* Funnel Progress Indicator */}
          <div className="mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-600">Progresso do Funil proptech-IA:</span>
              <span className="font-bold text-teal-700">{getFunnelProgress()}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getFunnelProgress()}%` }}
              ></div>
            </div>
          </div>

          {/* Extracted Profile Fields */}
          <div className="space-y-3">
            {/* Status Field */}
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                Status da Qualificação:
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                  leadProfile.status === "CONCLUIDO"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : leadProfile.status === "EM_ANDAMENTO"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {leadProfile.status === "CONCLUIDO"
                  ? "Concluído / Repassado"
                  : leadProfile.status === "EM_ANDAMENTO"
                  ? "Em Andamento"
                  : "Aguardando"}
              </span>
            </div>

            {/* Foco */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Objetivo Principal:
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {leadProfile.foco === "MORADIA" ? (
                    <span className="text-red-700 flex items-center gap-1">
                      <Home className="h-4 w-4" /> Moradia Própria
                    </span>
                  ) : leadProfile.foco === "INVESTIMENTO" ? (
                    <span className="text-teal-700 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" /> Investimento
                    </span>
                  ) : leadProfile.foco === "NAO_RECORDA" ? (
                    <span className="text-amber-700 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" /> Dúvida sobre cadastro
                    </span>
                  ) : (
                    <span className="text-slate-400 italic font-normal">
                      Não identificado
                    </span>
                  )}
                </span>
              </div>
              {leadProfile.foco && <CheckCircle className="h-5 w-5 text-green-600" />}
            </div>

            {/* Dynamic Fields based on Foco */}
            {leadProfile.foco === "MORADIA" && (
              <>
                <div className="p-2.5 bg-red-50/50 rounded-xl border border-red-100 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-red-600 block">
                    Dormitórios Solicitados:
                  </span>
                  <span className="font-semibold text-slate-800 block">
                    {leadProfile.dormitorios || (
                      <span className="text-slate-400 italic">Pendente...</span>
                    )}
                  </span>
                </div>

                <div className="p-2.5 bg-red-50/50 rounded-xl border border-red-100 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-red-600 block">
                    Prazo / Urgência para Mudança:
                  </span>
                  <span className="font-semibold text-slate-800 block">
                    {leadProfile.urgencia || (
                      <span className="text-slate-400 italic">Pendente...</span>
                    )}
                  </span>
                </div>

                <div className="p-2.5 bg-red-50/50 rounded-xl border border-red-100 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-red-600 block">
                    Região & Estilo de Vida:
                  </span>
                  <span className="font-semibold text-slate-800 block">
                    {leadProfile.regiaoEstilo || (
                      <span className="text-slate-400 italic">Pendente...</span>
                    )}
                  </span>
                </div>
              </>
            )}

            {leadProfile.foco === "INVESTIMENTO" && (
              <>
                <div className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-100 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-700 block">
                    Objetivo do Investimento:
                  </span>
                  <span className="font-semibold text-slate-800 block">
                    {leadProfile.objetivoInvestimento || (
                      <span className="text-slate-400 italic">Pendente...</span>
                    )}
                  </span>
                </div>

                <div className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-100 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-700 block">
                    Ticket / Orçamento de Aporte:
                  </span>
                  <span className="font-semibold text-slate-800 block">
                    {leadProfile.ticket || (
                      <span className="text-slate-400 italic">Pendente...</span>
                    )}
                  </span>
                </div>

                <div className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-100 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-700 block">
                    Experiência Prévia com Imóveis:
                  </span>
                  <span className="font-semibold text-slate-800 block">
                    {leadProfile.experiencia || (
                      <span className="text-slate-400 italic">Pendente...</span>
                    )}
                  </span>
                </div>
              </>
            )}

            {leadProfile.foco === "NAO_RECORDA" && (
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">
                  Confirmação de Interesse Atual:
                </span>
                <span className="font-semibold text-slate-800 block">
                  {leadProfile.confirmacaoInteresse || (
                    <span className="text-slate-400 italic">
                      Aguardando resposta do desarmamento...
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Action Button for Broker handoff */}
          {isConcluido && (
            <div className="mt-5 p-3 bg-green-50 border border-green-200 rounded-xl text-center">
              <p className="text-xs text-green-800 font-bold mb-2">
                🎉 Atendimento Repassado com Sucesso!
              </p>
              <button
                onClick={() => alert(`Iniciando conversa no WhatsApp de ${agentName}...`)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Chamar Cliente no WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Confirmation Dialog Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <LogOut className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Deseja sair / reiniciar o atendimento?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                O histórico do chat atual e os dados extraídos no painel do CRM serão limpos.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Continuar Atendimento
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  handleReset();
                }}
                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
              >
                Confirmar e Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

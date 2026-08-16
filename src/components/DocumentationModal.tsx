import React, { useState, useRef } from "react";
import {
  FileText,
  Download,
  Printer,
  X,
  Building2,
  Users,
  MapPin,
  FileCheck2,
  Kanban,
  Bot,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  Check
} from "lucide-react";
import jsPDF from "jspdf";

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentationModal({ isOpen, onClose }: DocumentationModalProps) {
  const [activeSection, setActiveSection] = useState<"ALL" | "EXPANSION" | "LEADS" | "WORKFLOW">("ALL");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const docContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Direct jsPDF Vector Document Generator (100% reliable, zero html2canvas/oklch issues)
  const handleDownloadPDF = () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      let y = 16;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - 16) {
          doc.addPage();
          y = 16;
          // Add header line on new pages
          doc.setDrawColor(226, 232, 240);
          doc.line(margin, 10, pageWidth - margin, 10);
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text("proptech-IA Intelligence Platform — Manual de Operações e Telas", margin, 8);
        }
      };

      // -------------------------------------------------------------
      // COVER / HEADER
      // -------------------------------------------------------------
      // Header Top Bar
      doc.setFillColor(15, 23, 42); // Slate 900
      doc.roundedRect(margin, y, contentWidth, 24, 3, 3, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(45, 212, 191); // Teal 400
      doc.text("proptech-IA", margin + 6, y + 9);

      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("Manual de Funcionalidades & Telas da Plataforma", margin + 6, y + 16);

      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")} | Versão: 2.5 Enterprise`, pageWidth - margin - 6, y + 16, { align: "right" });

      y += 30;

      // Intro Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 18, 2, 2, "FD");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const introText =
        "Este manual documenta visual e operacionalmente os 2 grandes módulos integrados da plataforma: Captação & Expansão de Terrenos (Incorporadoras) e Qualificação de Leads no WhatsApp (Vendas & Corretores).";
      const splitIntro = doc.splitTextToSize(introText, contentWidth - 8);
      doc.text(splitIntro, margin + 4, y + 6);

      y += 24;

      // -------------------------------------------------------------
      // SEÇÃO 1: CAPTAÇÃO & EXPANSÃO
      // -------------------------------------------------------------
      checkPageBreak(30);

      doc.setFillColor(220, 38, 38); // Red 600
      doc.roundedRect(margin, y, 6, 6, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("MÓDULO 1: CAPTAÇÃO & EXPANSÃO (INCORPORADORAS)", margin + 9, y + 5);

      y += 10;

      // Sub-abas de Expansão
      const expansionFeatures = [
        {
          title: "Aba 1: Inteligência & Mapeamento Urbano",
          badge: "Planejamento Regional",
          desc: "Mapeamento dos bairros estratégicos por cidade (São Paulo, Campinas, Santos, RJ, Curitiba). Apresenta Score de Potencial (0 a 100), Zoneamento (ZEU, ZM, ZC), Coeficiente de Aproveitamento (C.A.), Preço Médio do m² e Estimativa de VGV com IA.",
        },
        {
          title: "Aba 2: Captação & Abordagem de Proprietários",
          badge: "Inventário & Scripts IA",
          desc: "Cadastro, edição e exclusão de terrenos captados. Calcula automaticamente área construída máxima e VGV estimado conforme zoneamento. Gera scripts de abordagem hiper-personalizados adaptados ao perfil do proprietário (Herdeiros, Dono Único, Sócios).",
        },
        {
          title: "Aba 3: Validação Documental & Due Diligence IA",
          badge: "Auditoria de Riscos",
          desc: "Gera automaticamente checklist documental de 4 certidões para cada novo terreno. Permite filtrar por terreno, adicionar documentos manuais e executar re-auditoria com parecer inteligente da IA (Matrícula, IPTU, PGFN e Tombamento/Ambiental).",
        },
        {
          title: "Aba 4: Pipeline CRM & Planilhas",
          badge: "Funil Kanban & ERP",
          desc: "Controle em 6 fases de expansão (Descoberta → Contato → Análise Técnica → Proposta Enviada → Em Negociação → Fechado). Integração e sincronização com ERPs (Sienge, TOTVS Fluig, Salesforce) e exportação em planilhas CSV/Excel.",
        },
      ];

      expansionFeatures.forEach((feat) => {
        checkPageBreak(26);

        doc.setFillColor(254, 242, 242); // Red 50
        doc.setDrawColor(254, 202, 202); // Red 200
        doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(153, 27, 27); // Red 800
        doc.text(feat.title, margin + 4, y + 6);

        // Badge
        doc.setFontSize(7.5);
        doc.setTextColor(185, 28, 28);
        doc.text(`[ ${feat.badge} ]`, pageWidth - margin - 4, y + 6, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        const descLines = doc.splitTextToSize(feat.desc, contentWidth - 8);
        doc.text(descLines, margin + 4, y + 12);

        y += 25;
      });

      y += 4;

      // -------------------------------------------------------------
      // SEÇÃO 2: QUALIFICAÇÃO DE LEADS
      // -------------------------------------------------------------
      checkPageBreak(30);

      doc.setFillColor(13, 148, 136); // Teal 600
      doc.roundedRect(margin, y, 6, 6, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("MÓDULO 2: QUALIFICAÇÃO DE LEADS (VENDAS & CORRETORES)", margin + 9, y + 5);

      y += 10;

      const leadsFeatures = [
        {
          title: "Simulador WhatsApp com IA Humanizada",
          badge: "Interação Real",
          desc: "Simulação de conversa consultiva via WhatsApp. O assistente Aldo Santos aborda o lead, esclarece dúvidas do empreendimento e conduz o funil de qualificação de forma fluida e natural.",
        },
        {
          title: "Extração de Perfil em Tempo Real",
          badge: "Ficha Automática",
          desc: "A IA identifica automaticamente se o interesse é Moradia ou Investimento, extrai número de dormitórios desejados, faixa de orçamento, localização e urgência de compra, atualizando a ficha instantaneamente.",
        },
        {
          title: "Gatilhos Rápidos de Teste",
          badge: "Casos de Uso",
          desc: "Disponibiliza botões de teste ágeis: 'Quero informações do Concept Jardins', 'Apenas pesquisando valores' e 'Spam / Não me lembro de ter me cadastrado'.",
        },
        {
          title: "Exportação Formatada para CRM",
          badge: "Transbordo SDR",
          desc: "Gera arquivo TXT estruturado com histórico completo da conversa e dados do perfil prontos para envio ao CRM imobiliário e transbordo ao corretor responsável.",
        },
      ];

      leadsFeatures.forEach((feat) => {
        checkPageBreak(26);

        doc.setFillColor(240, 253, 250); // Teal 50
        doc.setDrawColor(204, 251, 241); // Teal 200
        doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(17, 94, 89); // Teal 800
        doc.text(feat.title, margin + 4, y + 6);

        doc.setFontSize(7.5);
        doc.setTextColor(15, 118, 110);
        doc.text(`[ ${feat.badge} ]`, pageWidth - margin - 4, y + 6, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        const descLines = doc.splitTextToSize(feat.desc, contentWidth - 8);
        doc.text(descLines, margin + 4, y + 12);

        y += 25;
      });

      y += 4;

      // -------------------------------------------------------------
      // SEÇÃO 3: FLUXOGRAMA OPERACIONAL
      // -------------------------------------------------------------
      checkPageBreak(36);

      doc.setFillColor(79, 70, 229); // Indigo 600
      doc.roundedRect(margin, y, 6, 6, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("3. FLUXOGRAMA OPERACIONAL INTEGRADO", margin + 9, y + 5);

      y += 10;

      const workflowSteps = [
        "1. Mapeamento Urbano: Identificação de bairros com alta liquidez e análise de zoneamento/C.A.",
        "2. Captação & Due Diligence: Cadastro do terreno, script IA para proprietário e auditoria de certidões.",
        "3. Lançamento & Campanhas: Estruturação do empreendimento e captação de potenciais compradores.",
        "4. Qualificação & Transbordo: IA qualifica no WhatsApp e entrega ficha pronta para fechamento comercial.",
      ];

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 32, 2, 2, "FD");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);

      let stepY = y + 6;
      workflowSteps.forEach((step) => {
        doc.text(step, margin + 4, stepY);
        stepY += 6.5;
      });

      y += 38;

      // Footer
      checkPageBreak(12);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text("Documento oficial gerado pela Plataforma proptech-IA — Todos os direitos reservados.", margin, y + 5);

      // Save PDF
      doc.save("proptech-ia-manual-documentacao.pdf");

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      // Fallback to print
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 print-document-modal">
      {/* Container Principal */}
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden my-auto print-document-content">
        
        {/* Top Action Bar (hidden in print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-xl border border-teal-500/30 text-teal-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Documentação Visual & Manual da Plataforma
                <span className="text-[11px] font-semibold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                  PDF & Telas
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Guia operacional visual: Captação & Expansão + Qualificação de Leads
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700 shadow-xs"
              title="Imprimir ou Salvar pelo Navegador com formatação nativa"
            >
              <Printer className="h-4 w-4 text-slate-300" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                downloadSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-teal-500 hover:bg-teal-400 text-slate-950"
              }`}
              title="Baixar arquivo .pdf diretamente"
            >
              {downloadSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>PDF Baixado!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>{isGeneratingPdf ? "Gerando..." : "Baixar PDF (.pdf)"}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              title="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs (hidden in print) */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs font-medium no-print">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-slate-500 mr-2 font-semibold">Visualizar Seções:</span>
            <button
              onClick={() => setActiveSection("ALL")}
              className={`px-3 py-1.5 rounded-lg transition font-semibold ${
                activeSection === "ALL"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              Todas as Telas
            </button>
            <button
              onClick={() => setActiveSection("EXPANSION")}
              className={`px-3 py-1.5 rounded-lg transition font-semibold flex items-center gap-1.5 ${
                activeSection === "EXPANSION"
                  ? "bg-red-600 text-white"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              1. Captação & Expansão
            </button>
            <button
              onClick={() => setActiveSection("LEADS")}
              className={`px-3 py-1.5 rounded-lg transition font-semibold flex items-center gap-1.5 ${
                activeSection === "LEADS"
                  ? "bg-teal-700 text-white"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              2. Qualificação de Leads
            </button>
            <button
              onClick={() => setActiveSection("WORKFLOW")}
              className={`px-3 py-1.5 rounded-lg transition font-semibold flex items-center gap-1.5 ${
                activeSection === "WORKFLOW"
                  ? "bg-indigo-700 text-white"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              3. Fluxo Operacional
            </button>
          </div>
          <span className="text-[11px] text-slate-500 italic">
            Clique em "Baixar PDF" para salvar o documento oficial ou "Imprimir" para visualização nativa.
          </span>
        </div>

        {/* DOCUMENT CONTENT */}
        <div
          ref={docContainerRef}
          className="p-6 sm:p-10 space-y-10 overflow-y-auto max-h-[75vh] bg-white print:max-h-none print:overflow-visible print:p-0"
        >
          {/* HEADER / COVER SECTION */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 print-break-inside-avoid">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-slate-900 text-teal-400 font-extrabold text-sm px-3 py-1 rounded-lg">
                  proptech-IA
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Manual Oficial de Funcionalidades
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Documentação Geral da Plataforma
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Guia visual e descritivo completo com todas as telas, fluxos de IA, opções de captação de terrenos para incorporadoras e qualificação de leads para vendas imobiliárias.
              </p>
            </div>
            <div className="text-right text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p><strong className="text-slate-800">Versão da Plataforma:</strong> 2.5 Enterprise</p>
              <p><strong className="text-slate-800">Data de Emissão:</strong> {new Date().toLocaleDateString("pt-BR")}</p>
              <p><strong className="text-slate-800">Módulos:</strong> Expansão + Qualificação</p>
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-break-inside-avoid">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                <Building2 className="h-5 w-5" />
                <span>MÓDULO 1: CAPTAÇÃO & EXPANSÃO (INCORPORADORAS)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Desenvolvido para Diretores de Expansão e Novos Negócios. Permite mapear bairros estratégicos, cadastrar terrenos, gerar scripts de abordagem com IA para proprietários, validar checklist de Due Diligence documental e sincronizar o funil de negócios com ERPs.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-semibold text-red-800">
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">🗺️ 1. Mapeamento Urbano</span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">🏗️ 2. Captação & Proprietários</span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">⚖️ 3. Validação Documental</span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">🔄 4. CRM & Planilhas</span>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <Users className="h-5 w-5" />
                <span>MÓDULO 2: QUALIFICAÇÃO DE LEADS (VENDAS & CORRETORES)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Desenvolvido para Corretores, Equipes de Pré-Vendas (SDRs) e Imobiliárias. Simula o atendimento inteligente no WhatsApp, descobrindo se o lead busca Moradia ou Investimento, extraindo perfil e transferindo a conversa já qualificada para o corretor fechar negócio.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-semibold text-teal-900">
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">💬 Simulador WhatsApp IA</span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">🎯 Extração em Tempo Real</span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">⚡ Gatilhos de Abordagem</span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">📄 Exportação Ficha TXT/CRM</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SEÇÃO 1: MÓDULO DE EXPANSÃO & CAPTAÇÃO DE TERRENOS                       */}
          {/* ========================================================================= */}
          {(activeSection === "ALL" || activeSection === "EXPANSION") && (
            <div className="space-y-8 pt-4">
              <div className="border-b border-slate-200 pb-2 flex items-center justify-between print-break-inside-avoid">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center text-sm font-black">
                    1
                  </span>
                  Módulo de Captação & Expansão (Incorporadoras)
                </h2>
                <span className="text-xs text-slate-500 font-semibold">4 Abas Operacionais Integradas</span>
              </div>

              {/* TELA 1.1: MAPEAMENTO URBANO */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 print-break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <h3 className="font-bold text-slate-900 text-base">
                      Aba 1: Inteligência & Mapeamento Urbano
                    </h3>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold">
                    Planejamento & Viabilidade Regional
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Permite explorar e comparar os bairros da cidade selecionada (ex: São Paulo, Campinas, Santos, Rio de Janeiro, Curitiba), avaliando métricas como <strong>Score de Potencial</strong>, <strong>Zoneamento (ZEU, ZM, ZC)</strong>, <strong>Coeficiente de Aproveitamento (C.A.)</strong>, <strong>Preço Médio do m²</strong> e <strong>VGV Estimado</strong>.
                </p>

                {/* Visual Representation / Mockup */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>VISUALIZAÇÃO DA TELA (MOCKUP INTERFACE):</span>
                    <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      💡 Sugestão de Novos Bairros com IA Ativa
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900">Pinheiros (Eixo Rebouças)</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Score 96/100</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Zoneamento: ZEU (C.A. 4.0) | R$ 16.800/m²</p>
                      <p className="text-[11px] text-slate-600">Alta densidade de transporte, polos de tecnologia e gastronomia.</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900">Vila Mariana (Eixo Metrô)</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Score 93/100</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Zoneamento: ZEU (C.A. 4.0) | R$ 14.500/m²</p>
                      <p className="text-[11px] text-slate-600">Polo universitário, alta liquidez para estúdios e 2 dormitórios.</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900">Santana (Eixo Voluntários)</span>
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Score 88/100</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Zoneamento: ZM (C.A. 2.5) | R$ 9.800/m²</p>
                      <p className="text-[11px] text-slate-600">Polo comercial da Zona Norte com demanda reprimida para alto padrão.</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-red-600 shrink-0" />
                    <span><strong>Ação com IA:</strong> Ao clicar em <em>"Sugerir Novos Bairros com IA"</em>, a Gemini analisa o Plano Diretor Municipal e sugere novas regiões de alto potencial com justificativa urbanística.</span>
                  </div>
                </div>
              </div>

              {/* TELA 1.2: CAPTAÇÃO & PROPRIETÁRIOS */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 print-break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-red-600" />
                    <h3 className="font-bold text-slate-900 text-base">
                      Aba 2: Captação & Abordagem de Proprietários
                    </h3>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold">
                    Cadastro, Edição, Exclusão & Scripts IA
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Gerenciamento completo do inventário de terrenos. Permite cadastrar novos terrenos com cálculo automático de <strong>Área Construída Máxima</strong>, <strong>VGV Estimado</strong>, <strong>Tipo de Negociação (Permuta Física, Permuta Financeira, Compra Direta)</strong>, além de <strong>Editar</strong> dados existentes e gerar <strong>Scripts de Abordagem Personalizados via IA</strong>.
                </p>

                {/* Mockup do Cadastro & Script */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
                    <div className="font-bold text-slate-800 flex items-center justify-between">
                      <span>FICHA DO TERRENO CADASTRADO</span>
                      <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-md font-bold">1.250 m²</span>
                    </div>
                    <div className="space-y-1 text-slate-600">
                      <p><strong className="text-slate-900">Nome:</strong> Gleba Rebouças / Pinheiros</p>
                      <p><strong className="text-slate-900">Endereço:</strong> Av. Rebouças, 2150 - São Paulo, SP</p>
                      <p><strong className="text-slate-900">Testada:</strong> 28 metros | <strong>Zoneamento:</strong> ZEU (C.A. 4.0)</p>
                      <p><strong className="text-slate-900">Área Construtível Máx:</strong> 5.000 m²</p>
                      <p><strong className="text-slate-900">VGV Estimado:</strong> R$ 48.000.000 (Permuta Física 16%)</p>
                      <p><strong className="text-slate-900">Proprietário:</strong> Família Silveira (Herdeiros)</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex gap-2">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[11px] font-semibold">✏️ Editar Terreno</span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[11px] font-semibold">🗑️ Excluir</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Bot className="h-4 w-4 text-red-600" />
                      <span>GERADOR DE SCRIPT DE ABORDAGEM IA</span>
                    </div>
                    <div className="bg-slate-900 text-slate-100 p-3 rounded-xl text-[11px] leading-relaxed font-mono">
                      "Olá, Dr. Silveira. Sou o Diretor de Expansão da incorporadora. Identificamos o excelente potencial do imóvel da Av. Rebouças para um projeto sustentável. Temos modelo de Permuta Física que protege o patrimônio da família com rentabilidade superior..."
                    </div>
                    <p className="text-[11px] text-slate-500">
                      ✨ O script se adapta automaticamente ao perfil do proprietário (Herdeiros vs Proprietário Único vs Sócios).
                    </p>
                  </div>
                </div>
              </div>

              {/* TELA 1.3: VALIDAÇÃO DOCUMENTAL */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 print-break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="h-5 w-5 text-red-600" />
                    <h3 className="font-bold text-slate-900 text-base">
                      Aba 3: Validação Documental & Due Diligence IA
                    </h3>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold">
                    Auditoria Automática & Manual
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Ao cadastrar qualquer novo terreno na Aba 2, o sistema <strong>gera automaticamente 4 itens de checklist documental</strong> vinculados ao imóvel. Permite filtrar o checklist por terreno específico ou visualizar todos, além de adicionar documentos manuais e executar re-auditoria com parecer de IA.
                </p>

                {/* Mockup Checklist */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                    <span>CHECKLIST DE DUE DILIGENCE POR TERRENO:</span>
                    <div className="flex gap-2 text-[10px]">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Aprovados</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">Em Análise</span>
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">Alerta / Risco</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-900">Matrícula & Cadeia Filiatória</span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">ANALISANDO</span>
                      </div>
                      <p className="text-[11px] text-slate-600">Certidão vintenária solicitada ao 14º Cartório de Registro de Imóveis.</p>
                      <span className="text-[10px] text-slate-400 block pt-1">🔍 Re-auditar com IA disponível</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-900">Certidão Negativa de IPTU</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">APROVADO</span>
                      </div>
                      <p className="text-[11px] text-slate-600">Certidão negativa municipal emitida sem débitos fiscais impeditivos.</p>
                      <span className="text-[10px] text-slate-400 block pt-1">🔍 Re-auditar com IA disponível</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-900">Diretrizes de Zoneamento & Uso</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">APROVADO</span>
                      </div>
                      <p className="text-[11px] text-slate-600">Ficha técnica confirmada: ZEU com potencial de até 4x a área do terreno.</p>
                      <span className="text-[10px] text-slate-400 block pt-1">🔍 Re-auditar com IA disponível</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-900">Tombamento & Passivos Ambientais</span>
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">ALERTA</span>
                      </div>
                      <p className="text-[11px] text-slate-600">Verificação preventiva de raio de proteção CONPRESP em andamento.</p>
                      <span className="text-[10px] text-slate-400 block pt-1">🔍 Re-auditar com IA disponível</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TELA 1.4: PIPELINE CRM & PLANILHAS */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 print-break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Kanban className="h-5 w-5 text-red-600" />
                    <h3 className="font-bold text-slate-900 text-base">
                      Aba 4: Pipeline CRM & Sincronização de Planilhas
                    </h3>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold">
                    Funil Kanban & Integração ERP
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Acompanhamento do ciclo de vida dos terrenos em 6 fases de expansão: <em>Descoberta → Contato com Proprietário → Análise Técnica → Proposta Enviada → Em Negociação → Fechado</em>. Permite exportar a planilha consolidada em CSV/Excel e sincronizar com ERPs de construção civil (Sienge, TOTVS Fluig, Salesforce Real Estate, Google Sheets Pro).
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px] font-bold text-slate-700">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">1. Descoberta</div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">2. Contato</div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">3. Análise</div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">4. Proposta</div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">5. Negociação</div>
                  <div className="bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-200">6. Fechado ✅</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SEÇÃO 2: MÓDULO DE QUALIFICAÇÃO DE LEADS (VENDAS)                          */}
          {/* ========================================================================= */}
          {(activeSection === "ALL" || activeSection === "LEADS") && (
            <div className="space-y-8 pt-4">
              <div className="border-b border-slate-200 pb-2 flex items-center justify-between print-break-inside-avoid">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center text-sm font-black">
                    2
                  </span>
                  Módulo de Qualificação de Leads (Vendas & Corretores)
                </h2>
                <span className="text-xs text-slate-500 font-semibold">Atendimento Humanizado WhatsApp + IA</span>
              </div>

              {/* TELA 2.1: SIMULADOR WHATSAPP & PAINEL DE INTELIGÊNCIA */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 print-break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-teal-600" />
                    <h3 className="font-bold text-slate-900 text-base">
                      Tela Principal: Simulador de WhatsApp & Extração em Tempo Real
                    </h3>
                  </div>
                  <span className="text-xs bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-full font-bold">
                    Integração com Gemini AI
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Ambiente que simula uma conversa direta com o cliente via WhatsApp. O corretor virtual conduz uma abordagem consultiva, identifica automaticamente se o interesse é <strong>Moradia</strong> ou <strong>Investimento</strong>, preenche a ficha do lead em tempo real e realiza o transbordo para o corretor humano.
                </p>

                {/* Mockup Split View */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left: Chat Simulator */}
                  <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                          AS
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Aldo Santos (Corretor Virtual)</p>
                          <p className="text-[10px] text-teal-600 font-semibold">● Online no WhatsApp</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-600">
                        Concept Jardins 🏢
                      </span>
                    </div>

                    {/* Chat Bubbles */}
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 max-w-[85%] text-slate-800 shadow-2xs">
                        "Quero informações sobre o residencial Concept Jardins."
                      </div>
                      <div className="bg-teal-50 text-teal-950 p-2.5 rounded-xl border border-teal-200 max-w-[85%] ml-auto shadow-2xs">
                        "Olá! Excelente escolha. O Concept Jardins fica em localização nobre. Você está pesquisando para <strong>moradia própria</strong> ou tem interesse como <strong>investimento</strong>?"
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 max-w-[85%] text-slate-800 shadow-2xs">
                        "Para morar com minha família, preciso de pelo menos 3 dormitórios com vaga."
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                      <span className="font-bold text-slate-700">Gatilhos Rápidos:</span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">1. Quero Info</span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">2. Pesquisando</span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">3. Spam / Não lembro</span>
                    </div>
                  </div>

                  {/* Right: Live Intelligence Extraction */}
                  <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-teal-600" />
                        FICHA EXTRAÍDA (TEMPO REAL)
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        EM ANDAMENTO
                      </span>
                    </div>

                    <div className="space-y-2 text-slate-700">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-bold">FOCO IDENTIFICADO:</span>
                        <span className="font-bold text-teal-800">🏠 MORADIA FAMILIAR</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-bold">DORMITÓRIOS:</span>
                        <span className="font-semibold text-slate-900">3 dormitórios + vaga</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-bold">URGÊNCIA ESTIMADA:</span>
                        <span className="font-semibold text-slate-900">Médio Prazo (3 a 6 meses)</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-bold">EXPORTAÇÃO:</span>
                        <span className="font-semibold text-teal-700">📥 Ficha TXT formatada para CRM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SEÇÃO 3: FLUXOGRAMA OPERACIONAL DE PONTA A PONTA                          */}
          {/* ========================================================================= */}
          {(activeSection === "ALL" || activeSection === "WORKFLOW") && (
            <div className="space-y-6 pt-4">
              <div className="border-b border-slate-200 pb-2 flex items-center justify-between print-break-inside-avoid">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-black">
                    3
                  </span>
                  Fluxograma Operacional & Jornada Integrada
                </h2>
                <span className="text-xs text-slate-500 font-semibold">End-to-End Workflow</span>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-6 print-break-inside-avoid">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  {/* Step 1 */}
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="text-teal-400 font-extrabold text-sm flex items-center gap-1.5">
                      <span>PASSO 1</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                    <h4 className="font-bold text-white">Mapeamento Regional</h4>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      A equipe de expansão pesquisa bairros com alta liquidez, confere o Plano Diretor (C.A. e zoneamento) e estima o VGV de novos empreendimentos.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="text-red-400 font-extrabold text-sm flex items-center gap-1.5">
                      <span>PASSO 2</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                    <h4 className="font-bold text-white">Captação & Due Diligence</h4>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Cadastro dos terrenos, geração do script de abordagem com IA para o proprietário e validação automática do checklist de certidões e matrículas.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="text-amber-400 font-extrabold text-sm flex items-center gap-1.5">
                      <span>PASSO 3</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                    <h4 className="font-bold text-white">Lançamento & Campanhas</h4>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      O terreno é aprovado e o produto imobiliário é formatado e lançado no mercado com captação de leads via campanhas digitais.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="text-emerald-400 font-extrabold text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <h4 className="font-bold text-white">Qualificação & Venda</h4>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      O corretor virtual qualifica 100% dos contatos no WhatsApp, gerando a ficha completa para a equipe comercial fechar as unidades.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER OF THE PRINTABLE DOCUMENT */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 print-break-inside-avoid">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">proptech-IA Intelligence Platform</span>
              <span>• Documento Gerado em {new Date().toLocaleDateString("pt-BR")}</span>
            </div>
            <span>Desenvolvido com Gemini AI, React, TypeScript & Tailwind CSS</span>
          </div>

        </div>
      </div>
    </div>
  );
}

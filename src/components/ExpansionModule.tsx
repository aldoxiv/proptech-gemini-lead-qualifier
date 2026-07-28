import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Search,
  Sparkles,
  FileCheck2,
  Database,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RefreshCw,
  Plus,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Send,
  Download,
  Check,
  BarChart3,
  Layers,
  Building,
  DollarSign,
  Scale
} from "lucide-react";
import {
  ExpansionRegion,
  LandOpportunity,
  LandDocument,
  CrmSyncLog,
  ExpansionStage
} from "../types";

export default function ExpansionModule() {
  // Active Tab inside Expansion Module
  const [activeTab, setActiveTab] = useState<
    "REGIONS" | "LAND_FINDER" | "DOCUMENTS" | "CRM_SYNC" | "APPROACH_AI"
  >("REGIONS");

  // Sample Expansion Regions Data
  const [regions, setRegions] = useState<ExpansionRegion[]>([
    {
      id: "reg-1",
      name: "Eixo Pinheiros & Rebouças",
      city: "São Paulo - SP",
      potentialScore: 94,
      zoning: "ZEU (Eixo Estruturação Urbana)",
      buildingRatio: 4.0,
      estimatedVgv: "R$ 180.000.000",
      pricePerSqm: "R$ 16.500/m²",
      growthDrivers: [
        "Proximidade da Estação de Metrô Fradique Coutinho",
        "Alta demanda para residenciais compactos de alto padrão",
        "Incentivos de Fachada Ativa e Uso Misto"
      ],
      demandLevel: "MUITO ALTA",
      status: "FOCO_EXPANSAO"
    },
    {
      id: "reg-2",
      name: "Chácara Santo Antônio / Granja Julieta",
      city: "São Paulo - SP",
      potentialScore: 89,
      zoning: "ZM (Zona Mista) / ZEU",
      buildingRatio: 3.5,
      estimatedVgv: "R$ 130.000.000",
      pricePerSqm: "R$ 12.800/m²",
      growthDrivers: [
        "Polo corporativo consolidado com alta demanda locatícia",
        "Nova ponte de acesso e infraestrutura cicloviária",
        "Permuta atrativa para terrenos de herdeiros"
      ],
      demandLevel: "ALTA",
      status: "FOCO_EXPANSAO"
    },
    {
      id: "reg-3",
      name: "Cambuí & Taquaral",
      city: "Campinas - SP",
      potentialScore: 86,
      zoning: "ZCR-2 (Zona Corredor Res.)",
      buildingRatio: 3.0,
      estimatedVgv: "R$ 95.000.000",
      pricePerSqm: "R$ 9.800/m²",
      growthDrivers: [
        "Lançamentos de luxo com conceito clube urbano",
        "Público de renda elevada e polo tecnológico próximo"
      ],
      demandLevel: "ALTA",
      status: "EM_ANALISE"
    },
    {
      id: "reg-4",
      name: "Barra da Tijuca (Jardim Oceânico)",
      city: "Rio de Janeiro - RJ",
      potentialScore: 82,
      zoning: "ZR-3 / Uso Misto",
      buildingRatio: 2.5,
      estimatedVgv: "R$ 110.000.000",
      pricePerSqm: "R$ 14.200/m²",
      growthDrivers: [
        "Perto do metrô e praia",
        "Valorização constante de metragens médias-grandes"
      ],
      demandLevel: "MÉDIA",
      status: "EM_ANALISE"
    }
  ]);

  // AI Regional Scout input
  const [regionQuery, setRegionQuery] = useState("");
  const [isScoutingRegion, setIsScoutingRegion] = useState(false);

  // Sample Land Opportunities Data
  const [lands, setLands] = useState<LandOpportunity[]>([
    {
      id: "land-101",
      title: "Gleba / Loteamento Rebouças - 1.450m²",
      address: "Av. Rebouças, 2100",
      neighborhood: "Pinheiros",
      city: "São Paulo - SP",
      areaSqm: 1450,
      frontageMeters: 32,
      zoning: "ZEU - Zona Eixo",
      maxBuildingAreaSqm: 5800,
      estimatedVgv: "R$ 82.000.000",
      askingPrice: "R$ 22.000.000",
      ownerName: "Família Alcantara (5 Herdeiros)",
      ownerType: "HERDEIROS_FAMILIA",
      dealType: "PERMUTA_FISICA",
      swapPercentage: 15,
      viabilityScore: 92,
      documentsStatus: "REGULAR",
      stage: "EM_NEGOCIACAO",
      lastUpdated: "Hoje às 10:15",
      notes: "Proposta de permuta física de 15% entregue. Família interessada em receber unidades no VGV futuro."
    },
    {
      id: "land-102",
      title: "Esquina Comercial Santo Amaro - 980m²",
      address: "Rua Américo Brasiliense, 1400",
      neighborhood: "Chácara Santo Antônio",
      city: "São Paulo - SP",
      areaSqm: 980,
      frontageMeters: 28,
      zoning: "ZM - Zona Mista",
      maxBuildingAreaSqm: 3430,
      estimatedVgv: "R$ 48.000.000",
      askingPrice: "R$ 13.500.000",
      ownerName: "Construtora & Imobiliária S.A.",
      ownerType: "EMPRESA_SOCIOS",
      dealType: "PERMUTA_FINANCEIRA",
      swapPercentage: 14,
      viabilityScore: 87,
      documentsStatus: "PENDENCIAS_LEVES",
      stage: "ANALISE_TECNICA",
      lastUpdated: "Ontem às 16:40",
      notes: "Estudo de massa (EVTL) em elaboração pela engenharia. Requer certidão atualizada do 4º Registro de Imóveis."
    },
    {
      id: "land-103",
      title: "Terreno Miolo do Cambuí - 1.100m²",
      address: "Rua Maria Monteiro, 820",
      neighborhood: "Cambuí",
      city: "Campinas - SP",
      areaSqm: 1100,
      frontageMeters: 25,
      zoning: "ZCR-2",
      maxBuildingAreaSqm: 3300,
      estimatedVgv: "R$ 38.000.000",
      askingPrice: "R$ 9.800.000",
      ownerName: "Dr. Roberto Martins",
      ownerType: "PROPRIETARIO_UNICO",
      dealType: "COMPRA_DIRETA",
      swapPercentage: 0,
      viabilityScore: 79,
      documentsStatus: "REGULAR",
      stage: "CONTATO_PROPRIETARIO",
      lastUpdated: "Há 2 dias",
      notes: "Proprietário direto aceita 20% de sinal e saldo em 12 parcelas corrigidas."
    }
  ]);

  // AI Land Viability Calculator Modal / State
  const [showAddLand, setShowAddLand] = useState(false);
  const [newLand, setNewLand] = useState({
    title: "",
    address: "",
    neighborhood: "",
    city: "São Paulo - SP",
    areaSqm: "1200",
    zoning: "ZEU",
    dealType: "PERMUTA_FISICA" as const,
    ownerName: "",
    ownerType: "HERDEIROS_FAMILIA" as const,
  });
  const [isAnalyzingLand, setIsAnalyzingLand] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);

  // Sample Documents Data
  const [documents, setDocuments] = useState<LandDocument[]>([
    {
      id: "doc-1",
      opportunityId: "land-101",
      opportunityTitle: "Gleba Rebouças - 1.450m²",
      docType: "MATRICULA_IMOVER",
      status: "APROVADO",
      analysisSummary: "Matrícula nº 148.920 livre de ônus e hipotecas. Cadeia filiatória 100% checada.",
      updatedAt: "28/07/2026 09:30"
    },
    {
      id: "doc-2",
      opportunityId: "land-101",
      opportunityTitle: "Gleba Rebouças - 1.450m²",
      docType: "CERTIDAO_IPTU",
      status: "APROVADO",
      analysisSummary: "Certidão Negativa de Débitos de IPTU emitida pela Prefeitura SP sem pendências.",
      updatedAt: "28/07/2026 09:32"
    },
    {
      id: "doc-3",
      opportunityId: "land-102",
      opportunityTitle: "Esquina Santo Amaro - 980m²",
      docType: "DIRETRIZES_ZONEAMENTO",
      status: "ANALISANDO",
      analysisSummary: "Consultando outorga onerosa e diretriz de preservação ambiental com órgão municipal.",
      updatedAt: "27/07/2026 15:10"
    },
    {
      id: "doc-4",
      opportunityId: "land-102",
      opportunityTitle: "Esquina Santo Amaro - 980m²",
      docType: "TOMBAMENTO_PATRIMONIO",
      status: "ALERTA",
      analysisSummary: "Alerta de entorno enquadrado em raio de bem tombado pelo CONDEPHAAT. Exige aprovação especial.",
      updatedAt: "27/07/2026 15:12"
    }
  ]);

  // AI Document Auditor State
  const [auditingDocId, setAuditingDocId] = useState<string | null>(null);
  const [auditNotes, setAuditNotes] = useState("");

  // Sample CRM Sync Logs
  const [syncLogs, setSyncLogs] = useState<CrmSyncLog[]>([
    {
      id: "log-1",
      timestamp: "28/07/2026 10:14:02",
      system: "Sienge ERP",
      recordsProcessed: 12,
      status: "SINCRONIZADO",
      notes: "Atualização automática de VGV e viabilidade técnica dos terrenos captados."
    },
    {
      id: "log-2",
      timestamp: "28/07/2026 09:00:00",
      system: "Google Sheets Pro",
      recordsProcessed: 12,
      status: "SINCRONIZADO",
      notes: "Sincronização com planilha da Diretoria de Expansão e Novos Negócios."
    },
    {
      id: "log-3",
      timestamp: "27/07/2026 18:30:15",
      system: "Salesforce Real Estate",
      recordsProcessed: 10,
      status: "SINCRONIZADO",
      notes: "Sync de leads de proprietários e status de negociação de permuta."
    }
  ]);

  const [isSyncing, setIsSyncing] = useState(false);

  // Approach Script Generator State
  const [selectedLandForScript, setSelectedLandForScript] = useState<LandOpportunity | null>(lands[0]);
  const [ownerScript, setOwnerScript] = useState<any | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  // Handlers
  const handleScoutRegion = async () => {
    if (!regionQuery.trim()) return;
    setIsScoutingRegion(true);
    setTimeout(() => {
      const newReg: ExpansionRegion = {
        id: `reg-${Date.now()}`,
        name: regionQuery,
        city: "Análise IA Regional",
        potentialScore: Math.floor(Math.random() * 15) + 82,
        zoning: "ZEU / ZM (Macroárea de Estruturação)",
        buildingRatio: 3.8,
        estimatedVgv: `R$ ${Math.floor(Math.random() * 80) + 70}.000.000`,
        pricePerSqm: `R$ ${(Math.floor(Math.random() * 6) + 11).toFixed(3)}/m²`,
        growthDrivers: [
          "Forte fluxo de demanda por lançamentos de médio/alto padrão",
          "Déficit habitacional local e potencial de adensamento vertical",
          "Excelente liquidez histórica de vendas em planta"
        ],
        demandLevel: "MUITO ALTA",
        status: "FOCO_EXPANSAO"
      };
      setRegions([newReg, ...regions]);
      setRegionQuery("");
      setIsScoutingRegion(false);
    }, 1200);
  };

  const handleAnalyzeNewLand = async () => {
    if (!newLand.title.trim()) return;
    setIsAnalyzingLand(true);

    try {
      const res = await fetch("/api/expansion/ai-analyze-land", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landTitle: newLand.title,
          areaSqm: newLand.areaSqm,
          zoning: newLand.zoning,
          city: newLand.city,
          neighborhood: newLand.neighborhood,
          dealType: newLand.dealType,
          ownerType: newLand.ownerType
        })
      });
      const data = await res.json();
      setAiAnalysisResult(data);

      // Add to lands list
      const addedLand: LandOpportunity = {
        id: `land-${Date.now()}`,
        title: newLand.title,
        address: newLand.address || `${newLand.neighborhood}, ${newLand.city}`,
        neighborhood: newLand.neighborhood || "Região Estratégica",
        city: newLand.city,
        areaSqm: Number(newLand.areaSqm) || 1200,
        frontageMeters: 26,
        zoning: newLand.zoning,
        maxBuildingAreaSqm: (Number(newLand.areaSqm) || 1200) * 4,
        estimatedVgv: data.estimatedVgv || "R$ 60.000.000",
        askingPrice: "Sob Consulta",
        ownerName: newLand.ownerName || "Proprietários Mapeados",
        ownerType: newLand.ownerType,
        dealType: newLand.dealType,
        swapPercentage: 15,
        viabilityScore: data.viabilityScore || 88,
        documentsStatus: "REGULAR",
        stage: "DESCOBERTA",
        lastUpdated: "Agora mesmo",
        notes: data.zoningAnalysis || "Novo terreno cadastrado para captação e expansão."
      };

      setLands([addedLand, ...lands]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingLand(false);
    }
  };

  const handleRunDocAudit = async (doc: LandDocument) => {
    setAuditingDocId(doc.id);
    try {
      const res = await fetch("/api/expansion/audit-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docTitle: doc.opportunityTitle,
          docType: doc.docType,
          notes: auditNotes
        })
      });
      const data = await res.json();

      setDocuments(
        documents.map((d) =>
          d.id === doc.id
            ? {
                ...d,
                status: data.status || "APROVADO",
                analysisSummary: data.summary || d.analysisSummary,
                updatedAt: "Agora mesmo"
              }
            : d
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setAuditingDocId(null);
      setAuditNotes("");
    }
  };

  const handleSyncCrm = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR")}`;
      const newLogs: CrmSyncLog[] = [
        {
          id: `log-${Date.now()}-1`,
          timestamp: timeStr,
          system: "Sienge ERP",
          recordsProcessed: lands.length,
          status: "SINCRONIZADO",
          notes: "Atualização automática do pipeline de terrenos e estudos de VGV."
        },
        {
          id: `log-${Date.now()}-2`,
          timestamp: timeStr,
          system: "Google Sheets Pro",
          recordsProcessed: lands.length,
          status: "SINCRONIZADO",
          notes: "Planilha de Expansão Imobiliária sincronizada em tempo real."
        },
        ...syncLogs
      ];
      setSyncLogs(newLogs);
      setIsSyncing(false);
    }, 1500);
  };

  const handleGenerateApproachScript = async () => {
    if (!selectedLandForScript) return;
    setIsGeneratingScript(true);
    try {
      const res = await fetch("/api/expansion/generate-owner-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName: selectedLandForScript.ownerName,
          landTitle: selectedLandForScript.title,
          dealType: selectedLandForScript.dealType,
          ownerType: selectedLandForScript.ownerType,
          city: selectedLandForScript.city
        })
      });
      const data = await res.json();
      setOwnerScript(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Título,Endereço,Bairro,Cidade,Área (m²),Zoneamento,VGV Estimado,Proprietário,Modelo,Estágio,Viabilidade"]
        .concat(
          lands.map(
            (l) =>
              `"${l.title}","${l.address}","${l.neighborhood}","${l.city}",${l.areaSqm},"${l.zoning}","${l.estimatedVgv}","${l.ownerName}","${l.dealType}","${l.stage}",${l.viabilityScore}%`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Expansao_Terrenos_Lopes_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* MODULE BANNER / METRICS */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.25),transparent_70%)] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 backdrop-blur-md">
              <Building2 className="h-3.5 w-3.5 text-red-400" />
              Módulo para Incorporadoras & Expansão
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Captação Inteligente de Terrenos & Áreas
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Plataforma impulsionada por IA para prospecção de imóveis, análise de potencial construtivo, estruturação de permutas e sincronização de CRM.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSyncCrm}
              disabled={isSyncing}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg flex items-center gap-2 border border-red-500/30 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Sincronizando CRM..." : "Sincronizar CRM / Planilhas"}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-3.5 py-2.5 rounded-xl text-xs transition backdrop-blur-md border border-white/15 flex items-center gap-1.5"
              title="Exportar Planilha Excel/CSV"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 relative z-10">
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              VGV Mapeado
            </span>
            <span className="text-lg font-black text-amber-400">R$ 388 Mi</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Terrenos em Carteira
            </span>
            <span className="text-lg font-black text-white">{lands.length} Áreas</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Regiões Foco IA
            </span>
            <span className="text-lg font-black text-emerald-400">{regions.length} Regiões</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Docs Auditados
            </span>
            <span className="text-lg font-black text-sky-400">
              {documents.filter((d) => d.status === "APROVADO").length} / {documents.length} OK
            </span>
          </div>
        </div>
      </div>

      {/* PILLAR SUB-NAVIGATION TABS (The 5 core pillars from the PDF) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("REGIONS")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "REGIONS"
              ? "bg-red-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>1. Pesquisa de Regiões (IA)</span>
        </button>

        <button
          onClick={() => setActiveTab("LAND_FINDER")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "LAND_FINDER"
              ? "bg-red-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>2. Captação & Proprietários</span>
        </button>

        <button
          onClick={() => setActiveTab("DOCUMENTS")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "DOCUMENTS"
              ? "bg-red-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>3. Validação Documental</span>
        </button>

        <button
          onClick={() => setActiveTab("CRM_SYNC")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "CRM_SYNC"
              ? "bg-red-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Database className="h-4 w-4" />
          <span>4. CRM & Planilhas</span>
        </button>

        <button
          onClick={() => setActiveTab("APPROACH_AI")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "APPROACH_AI"
              ? "bg-red-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>5. Roteiro de Abordagem</span>
        </button>
      </div>

      {/* TAB 1: REGIONS & EXPANSION POTENTIAL */}
      {activeTab === "REGIONS" && (
        <div className="space-y-6">
          {/* AI Regional Search Bar */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-red-600" />
                  Mapeador IA de Regiões em Expansão
                </h3>
                <p className="text-xs text-slate-500">
                  Pesquise qualquer bairro ou cidade para identificar zoneamento, potencial de VGV e vetores de crescimento.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={regionQuery}
                  onChange={(e) => setRegionQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScoutRegion()}
                  placeholder="Ex: Tatuapé, Faria Lima, Barueri Alphaville, Curitiba Batel..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              </div>
              <button
                onClick={handleScoutRegion}
                disabled={isScoutingRegion || !regionQuery.trim()}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 disabled:opacity-50"
              >
                {isScoutingRegion ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Mapeando...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Analisar Região</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Region Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regions.map((reg) => (
              <div
                key={reg.id}
                className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 hover:border-red-300 transition space-y-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                      {reg.city}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{reg.name}</h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-500 font-medium block">Índice IA:</span>
                    <span className="text-lg font-black text-emerald-600">
                      {reg.potentialScore}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Zoneamento Predominante:
                    </span>
                    <span className="font-semibold text-slate-800">{reg.zoning}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Coeficiente (C.A. Máx):
                    </span>
                    <span className="font-bold text-red-700">{reg.buildingRatio}x a área</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Preço Médio m² Terreno:
                    </span>
                    <span className="font-semibold text-slate-800">{reg.pricePerSqm}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      VGV Potencial Estimado:
                    </span>
                    <span className="font-bold text-amber-700">{reg.estimatedVgv}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Vetores de Crescimento Identificados:
                  </span>
                  <ul className="space-y-1">
                    {reg.growthDrivers.map((driver, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Demanda para Lançamentos:</span>
                  <span className="font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] uppercase border border-red-200">
                    {reg.demandLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LAND FINDER & OPPORTUNITIES */}
      {activeTab === "LAND_FINDER" && (
        <div className="space-y-6">
          {/* Header & New Land Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-red-600" />
                Oportunidades de Captação e Negociação
              </h3>
              <p className="text-xs text-slate-500">
                Terrenos e imóveis mapeados com perfil do proprietário e estrutura de negócio.
              </p>
            </div>

            <button
              onClick={() => setShowAddLand(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Cadastrar Novo Terreno</span>
            </button>
          </div>

          {/* Land Opportunity Cards List */}
          <div className="space-y-4">
            {lands.map((land) => (
              <div
                key={land.id}
                className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 hover:border-red-300 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                        {land.zoning}
                      </span>
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                        Viabilidade IA: {land.viabilityScore}%
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{land.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {land.address} ({land.neighborhood} - {land.city})
                    </p>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-xs text-slate-400 font-medium block">
                      VGV Estimado:
                    </span>
                    <span className="text-lg font-black text-red-700">
                      {land.estimatedVgv}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Área Total:
                    </span>
                    <span className="font-bold text-slate-800">{land.areaSqm} m²</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Potencial Construtivo:
                    </span>
                    <span className="font-bold text-slate-800">
                      {land.maxBuildingAreaSqm} m² (C.A. 4x)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Perfil Proprietário:
                    </span>
                    <span className="font-semibold text-slate-800">{land.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Estrutura de Acordo:
                    </span>
                    <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {land.dealType === "PERMUTA_FISICA"
                        ? `Permuta Física (${land.swapPercentage}%)`
                        : land.dealType === "PERMUTA_FINANCEIRA"
                        ? `Permuta Fin. (${land.swapPercentage}%)`
                        : "Compra Direta"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50">
                  <strong className="text-amber-900">Observações de Negociação:</strong>{" "}
                  {land.notes}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Atualizado em: {land.lastUpdated}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedLandForScript(land);
                      setActiveTab("APPROACH_AI");
                    }}
                    className="text-red-700 hover:text-red-800 font-bold flex items-center gap-1 hover:underline"
                  >
                    <span>Gerar Roteiro de Abordagem IA</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Land Modal */}
          {showAddLand && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-red-600" />
                    Cadastrar Oportunidade & Viabilidade IA
                  </h3>
                  <button
                    onClick={() => setShowAddLand(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Identificação do Terreno / Projeto:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Terreno Jardins Alameda Santos"
                      value={newLand.title}
                      onChange={(e) => setNewLand({ ...newLand, title: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Área em m²:
                      </label>
                      <input
                        type="number"
                        placeholder="1200"
                        value={newLand.areaSqm}
                        onChange={(e) => setNewLand({ ...newLand, areaSqm: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Zoneamento:
                      </label>
                      <input
                        type="text"
                        placeholder="ZEU / ZM"
                        value={newLand.zoning}
                        onChange={(e) => setNewLand({ ...newLand, zoning: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Bairro:
                      </label>
                      <input
                        type="text"
                        placeholder="Pinheiros"
                        value={newLand.neighborhood}
                        onChange={(e) => setNewLand({ ...newLand, neighborhood: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Cidade:
                      </label>
                      <input
                        type="text"
                        value={newLand.city}
                        onChange={(e) => setNewLand({ ...newLand, city: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Modelo de Negócio Desejado:
                      </label>
                      <select
                        value={newLand.dealType}
                        onChange={(e) =>
                          setNewLand({ ...newLand, dealType: e.target.value as any })
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                      >
                        <option value="PERMUTA_FISICA">Permuta Física</option>
                        <option value="PERMUTA_FINANCEIRA">Permuta Financeira</option>
                        <option value="COMPRA_DIRETA">Compra Direta</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Perfil Proprietário:
                      </label>
                      <select
                        value={newLand.ownerType}
                        onChange={(e) =>
                          setNewLand({ ...newLand, ownerType: e.target.value as any })
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                      >
                        <option value="HERDEIROS_FAMILIA">Família / Herdeiros</option>
                        <option value="PROPRIETARIO_UNICO">Proprietário Único</option>
                        <option value="EMPRESA_SOCIOS">Empresa / Sócios</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => setShowAddLand(false)}
                    className="flex-1 py-2.5 px-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={async () => {
                      await handleAnalyzeNewLand();
                      setShowAddLand(false);
                    }}
                    disabled={isAnalyzingLand}
                    className="flex-1 py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1"
                  >
                    {isAnalyzingLand ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    <span>Gerar Viabilidade & Salvar</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DOCUMENT AUDIT & DUE DILIGENCE */}
      {activeTab === "DOCUMENTS" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-red-600" />
              Auditoria de Informações Cadastrais e Documentais (Due Diligence IA)
            </h3>
            <p className="text-xs text-slate-500">
              Checklist de auditoria de matrículas, certidões negativas, passivos fiscais e restrições ambientais dos terrenos captados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {doc.opportunityTitle}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                      {doc.docType.replace(/_/g, " ")}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                      doc.status === "APROVADO"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : doc.status === "ANALISANDO"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-amber-100 text-amber-900 border-amber-200 animate-pulse"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-1">Parecer da Auditoria:</span>
                  {doc.analysisSummary}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 text-[10px]">Verificado: {doc.updatedAt}</span>
                  <button
                    onClick={() => handleRunDocAudit(doc)}
                    disabled={auditingDocId === doc.id}
                    className="text-red-700 font-bold hover:underline flex items-center gap-1 text-xs"
                  >
                    {auditingDocId === doc.id ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ShieldCheck className="h-3.5 w-3.5" />
                    )}
                    <span>Re-auditar com IA</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CRM PIPELINE & SPREADSHEET SYNC */}
      {activeTab === "CRM_SYNC" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Database className="h-4 w-4 text-red-600" />
                  Sincronização de CRM, Sistemas Internos e Planilhas
                </h3>
                <p className="text-xs text-slate-500">
                  Alimentação automática de sistemas corporativos (Sienge ERP, TOTVS, Salesforce e Google Sheets).
                </p>
              </div>

              <button
                onClick={handleSyncCrm}
                disabled={isSyncing}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                <span>Disparar Sincronização Agora</span>
              </button>
            </div>
          </div>

          {/* Kanban Pipeline Overview */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pipeline de Estágios de Expansão (Módulo Captação)
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2">
              {[
                { stage: "DESCOBERTA", label: "1. Descoberta", color: "bg-slate-100 text-slate-700" },
                { stage: "CONTATO_PROPRIETARIO", label: "2. Contato", color: "bg-blue-50 text-blue-800" },
                { stage: "ANALISE_TECNICA", label: "3. Análise Técnica", color: "bg-purple-50 text-purple-800" },
                { stage: "PROPOSTA_ENVIADA", label: "4. Proposta", color: "bg-amber-50 text-amber-800" },
                { stage: "EM_NEGOCIACAO", label: "5. Negociação", color: "bg-teal-50 text-teal-800" },
                { stage: "FECHADO", label: "6. Fechado / CCV", color: "bg-emerald-50 text-emerald-800" }
              ].map((st, idx) => {
                const count = lands.filter((l) => l.stage === st.stage).length;
                return (
                  <div key={idx} className={`p-3 rounded-xl border border-slate-200 ${st.color}`}>
                    <span className="text-[10px] font-bold block">{st.label}</span>
                    <span className="text-base font-black mt-1 block">{count} Terreno(s)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Integration Sync Logs */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Histórico de Sincronizações com Sistemas ERP / Planilhas
            </h4>

            <div className="space-y-2">
              {syncLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg font-bold text-[10px]">
                      SYNC OK
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800">{log.system}</h5>
                      <p className="text-[11px] text-slate-500">{log.notes}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block">
                      {log.timestamp}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {log.recordsProcessed} registros afetados
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AI OWNER APPROACH SCRIPT GENERATOR */}
      {activeTab === "APPROACH_AI" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-red-600" />
                Copiloto de Abordagem e Negociação com Proprietários
              </h3>
              <p className="text-xs text-slate-500">
                Gere abordagens de alta conversão para famílias, herdeiros ou sócios corporativos visando permuta física ou compra.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full">
                <label className="text-[11px] font-bold text-slate-500 block mb-1">
                  Selecione o Terreno / Proprietário a Abordar:
                </label>
                <select
                  value={selectedLandForScript?.id || ""}
                  onChange={(e) => {
                    const l = lands.find((x) => x.id === e.target.value);
                    setSelectedLandForScript(l || null);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {lands.map((land) => (
                    <option key={land.id} value={land.id}>
                      {land.title} — {land.ownerName} ({land.dealType})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerateApproachScript}
                disabled={isGeneratingScript || !selectedLandForScript}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 mt-4 sm:mt-5"
              >
                {isGeneratingScript ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Gerando Abordagem...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Gerar Roteiro Personalizado</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Script Display */}
          {ownerScript && (
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Roteiro de Abordagem & Script Gerado
                </h4>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(ownerScript.whatsappScript);
                    alert("Script copiado para a área de transferência!");
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                >
                  Copiar Mensagem
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs leading-relaxed font-mono whitespace-pre-line border border-slate-800">
                {ownerScript.whatsappScript}
              </div>

              {ownerScript.keyArguments && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Gatilhos e Argumentos Principais de Negociação:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {ownerScript.keyArguments.map((arg: string, idx: number) => (
                      <div
                        key={idx}
                        className="bg-red-50/60 p-3 rounded-xl border border-red-200/50 text-xs text-red-900 font-medium"
                      >
                        • {arg}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

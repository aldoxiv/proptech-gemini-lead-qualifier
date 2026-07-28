export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface LeadProfile {
  foco: "MORADIA" | "INVESTIMENTO" | "NAO_RECORDA" | null;
  dormitorios: string | null;
  urgencia: string | null;
  objetivoInvestimento: string | null;
  ticket: string | null;
  experiencia: string | null;
  regiaoEstilo: string | null;
  confirmacaoInteresse: string | null;
  status: "AGUARDANDO_INICIO" | "EM_ANDAMENTO" | "CONCLUIDO";
}

export type ExpansionStage =
  | "DESCOBERTA"
  | "CONTATO_PROPRIETARIO"
  | "ANALISE_TECNICA"
  | "PROPOSTA_ENVIADA"
  | "EM_NEGOCIACAO"
  | "FECHADO";

export interface ExpansionRegion {
  id: string;
  name: string;
  city: string;
  potentialScore: number; // 0 to 100
  zoning: string; // Ex: ZEU, ZM, ZC
  buildingRatio: number; // Coeficiente de Aproveitamento (C.A. max)
  estimatedVgv: string; // R$ 120 Mi
  pricePerSqm: string; // R$ 12.500/m²
  growthDrivers: string[];
  demandLevel: "ALTA" | "MÉDIA" | "MUITO ALTA";
  status: "EM_ANALISE" | "FOCO_EXPANSAO" | "SATURADO";
}

export interface LandOpportunity {
  id: string;
  title: string;
  address: string;
  neighborhood: string;
  city: string;
  areaSqm: number;
  frontageMeters: number;
  zoning: string;
  maxBuildingAreaSqm: number;
  estimatedVgv: string;
  askingPrice: string;
  ownerName: string;
  ownerType: "PROPRIETARIO_UNICO" | "HERDEIROS_FAMILIA" | "EMPRESA_SOCIOS";
  dealType: "PERMUTA_FISICA" | "PERMUTA_FINANCEIRA" | "COMPRA_DIRETA" | "MISTA";
  swapPercentage: number; // Ex: 15%
  viabilityScore: number; // 0-100
  documentsStatus: "REGULAR" | "PENDENCIAS_LEVES" | "EM_REGULARIZACAO";
  stage: ExpansionStage;
  lastUpdated: string;
  notes: string;
}

export interface LandDocument {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  docType:
    | "MATRICULA_IMOVER"
    | "CERTIDAO_IPTU"
    | "CERTIDAO_PGFN_DEBITOS"
    | "DIRETRIZES_ZONEAMENTO"
    | "ESTUDO_AMBIENTAL"
    | "TOMBAMENTO_PATRIMONIO";
  status: "APROVADO" | "ANALISANDO" | "ALERTA";
  analysisSummary: string;
  updatedAt: string;
}

export interface CrmSyncLog {
  id: string;
  timestamp: string;
  system: "Sienge ERP" | "TOTVS Fluig" | "Salesforce Real Estate" | "Google Sheets Pro" | "HubSpot CRM";
  recordsProcessed: number;
  status: "SINCRONIZADO" | "PENDENTE";
  notes: string;
}


export type ContractType = 'FIXED' | 'QUASI' | 'HYBRID';
export type IPPattern = 'A' | 'B';
export type PaymentType = 'SINGLE' | 'MILESTONE';

export interface EstimateItem {
  id: string;
  category: string; // 大項目
  subCategory?: string; // 中項目（工程）
  name: string; // 小項目（名称）
  details: string; // 仕様
  unitPrice: number;
  quantity: number;
  unit: string;
}

export interface CompanyInfo {
  companyName: string;
  address: string;
  representative: string;
  projectName: string;
}

export interface ProviderInfo {
  companyName: string;
  zipCode: string;
  address: string;
  building: string;
  representative: string;
  tel: string;
  personInCharge: string;
}

export interface QuasiPattern {
  name: string;
  price: string;
  condition: string;
  overtime: string;
}

export interface EstimateData {
  id: string;
  estimateNumber: string; // 見積書番号
  createdAt: string;
  documentDate: string;
  client: CompanyInfo;
  provider: ProviderInfo;
  items: EstimateItem[];
  discount: number;
  contractDate: string;
  workStartDate: string;
  workEndDate: string;
  deliveryDate: string;
  contractType: ContractType;
  ipPattern: IPPattern;
  estimateValidity: string;
  paymentType: PaymentType;
  revisions: {
    design: number;
    coding: number;
    others: string;
  };
  quasiPatterns: {
    selected: 'A' | 'B' | 'C' | 'D';
    A: QuasiPattern;
    B: QuasiPattern;
    C: QuasiPattern;
    D: QuasiPattern;
  };
  deliverables: {
    final: string;
    intermediate: string;
    sourceData: boolean;
    sourceFormat: string;
  };
  hasPhotography: boolean;
  photoDetails: {
    days: string;
    hours: string;
    cuts: string;
    modelInfo: string;
    rightsHandling: 'CLIENT' | 'PROVIDER';
  };
  hasNotes: boolean;
  notes: string;
}

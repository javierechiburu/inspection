export type OptionType = {
  id: number;
  name: string;
};

export type InspectionType = {
  id: number;
  created: string;
  scheduled: string;
  modified?: string;
  completed?: string;
  type: OptionType;
  status: OptionType;
  address: string;
  branch?: OptionType;
  plate: string;
  brand: string;
  model: string;
  year: number;
  user: OptionType;
  configId?: string;
  isDraft?: boolean;
};

export type PaginatedInspections = {
  docs: InspectionType[];
  total: number;
  pages: number;
  current: number;
  limit: number;
};

export type ResponseData = {
  error: false;
  message: null;
  status: 200;
  data: PaginatedInspections;
};

export type ToggleFunctions = {
  toggleInspector?: () => void;
  toggleDate?: () => void;
  toggleLocation?: () => void;
  toggleUploadImages?: () => void;
  toggleDownloadImages?: () => void;
  redirectToDetail?: () => void;
  redirectToForm?: () => void;
  redirectToFormId?: () => void;
  startInspection?: () => void;
};

export type FilterValues = {
  location?: string;
  inspector?: string;
  inspectionType?: string;
  inspectionStatus?: string;
  page?: number;
};

export type UserRole = 'inspector' | 'coordinador' | 'supervisor' | 'visualizador';

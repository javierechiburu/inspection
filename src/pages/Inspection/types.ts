export interface InspectionData {
  id: string;
  inspectionId: string;
  country: string;
  inspector: string;
  inspectorId: string;
  configId: string;
  originalInspection: null | string; // Puede ser null o string
  type: string;
  qcInspectionId: string;
  isDraft: boolean;
  createdAt: string; // Deberías considerar usar un tipo de fecha apropiado
  startTime: null | string; // Puede ser null o string
  endTime: null | string; // Puede ser null o string
  urlPhotos: string;
  categories: { id: number; score: number; title: string }[];
  car: {
    brand: string;
    model: string;
    year: number;
    version: string;
    motor: string;
    plate: string;
    chassisColor: string;
    fuel: string;
    transmission: string;
    vin: string;
  };
  report: {
    id: number;
    title: string;
    data: {
      id: number;
      title: string;
      value: string[] | string;
      photos: Photo;
      url: string;
    }[];
  }[];
  gallery: {
    id: string;
    gallery: string;
    images: {
      id: string;
      description: string;
      tags: string[];
      src: string;
      alt: string;
    }[];
  }[];
}

export interface CategoriesData {
  id: number;
  score: number;
  title: string;
}

export interface ReportData {
  id: number;
}

export interface ReportItemData {
  id: number;
  title: string;
  value: string[] | string | PhotoList[] | boolean;
  photos?: Photo;
  url?: string;
}

export type PhotoList = {
  id: string;
  key: string;
  description?: string;
};

export interface Photo {
  id: string;
  alt?: string;
  description: string;
  tags: string[];
  src?: string;
  imageIds?: string[];
}

export interface Gallery {
  id: string;
  title: string;
  gallery?: string;
  images: {
    id: string;
    name?: string;
    description: string;
    tags: string[];
  }[];
}

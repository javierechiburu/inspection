/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';
import { GalleryItem } from '../types';

export type WizardContextType = {
  id?: string;
  step: number;
  changeStep: (step: number) => void;
  updateField: (key: string, value: any) => void;
  updateGallery: (key: string, value: any) => void;
  getField: (key: string) => string;
  getGalleriesField: (key: string) => GalleryItem[];
  getGalleriesDescription: (questionId: string) => string;
  checkRequiredFields: (section: string | null) => any[];
  saveDraft: (type: string) => void;
  fields: Record<string, any>;
  galleries: Record<string, any>;
};

const WizardContext = createContext<WizardContextType | null>(null);

export default WizardContext;

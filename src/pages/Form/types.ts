/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Control, UseFormSetValue } from 'react-hook-form';

export type Report = {
  [key: string]: string | boolean | Array<string> | number;
};

export type GalleryItem = {
  description?: string;
  id: string;
  key: string;
  value?: string;
  tags?: string[];
};

export type Image = {
  description: string;
  tags: Array<string>;
  questionId: string;
  items: Array<GalleryItem>;
};

export type GalleryDescription = {
  questionId: string;
  description: string;
};

export type Gallery = {
  id: string;
  type: string;
  image: Array<Image>;
};

export type InspectionData = {
  id: string;
  companyCode: string;
  isDraft: boolean;
  inspectionStatus: string;
  configId: string;
  inspectorId: string;
  inspectorName: string;
  startTime: string;
  endTime: string;
  gallery: Array<Gallery>;
  report: Report;
  isDeleted: boolean;
};

export type InspectionConfigGroup = {
  id: string;
  title: string;
  data: any[];
  type?: string;
};

export type InspectionConfig = {
  key: string;
  title: string;
  id: string;
  groups: InspectionConfigGroup[];
};

export type InspectionConfigOption = {
  label: string;
  value: string | number;
  selectWhen?: boolean;
};

export type InspectionConfigOptionParam = {
  id: string | null;
  key: string;
  value: string;
};

export type InspectionConfigField = {
  id: string;
  component: string;
  required: boolean;
  title: string;
  options?: InspectionConfigOption[];
  optionParams?: InspectionConfigOptionParam[];
  optionsVia?: string;
  dependencies?: string[];
  update?: string[];
  visibleWhen?: {
    equals?: string;
    value: boolean | string[];
    in?: string[];
    notIn?: string[];
    id: string;
  };
  label1?: string;
  label2?: string;
  galleryId?: string;
  data?: InspectionConfigImage[];
  hideLabel?: boolean;
  addGalleryWhen?: AddGalleryWhen;
  descriptionType?: 'globalDescription' | 'itemDescription';
  forceUppercaseInput?: boolean;
  regex?: string;
};

export type InspectionConfigImage = {
  blur: boolean;
  id: string;
  name: string;
  tags: string[];
  type: string;
};

export type FieldProps = {
  control: Control<any, any>;
  field: InspectionConfigField;
  disabled?: boolean;
  onBlur: any;
  onChange: any;
  setValue: UseFormSetValue<any>;
  value: any;
  regex?: string;
  isRequired?: boolean;
};

export type ImageGalleryItem = {
  id: string;
  name: string;
  value?: File;
};

export type ImageListItem = {
  id: string;
  description?: string;
  tags?: string[];
  value?: File | string;
};

export type AddGalleryWhen = {
  descriptionType: 'globalDescription' | 'itemDescription';
  equals: string[];
  galleryId: string;
};

export type NotAnsweredField = {
  question: string;
  questionTitle: string;
  section: string;
};

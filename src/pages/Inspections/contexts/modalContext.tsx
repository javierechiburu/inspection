import { createContext, useState } from 'react';
import type { FC, PropsWithChildren } from 'react';
import type { InspectionType } from '../types';

export type ModalContextType = {
  inspector: boolean;
  toggleInspector: () => void;
  date: boolean;
  toggleDate: () => void;
  location: boolean;
  toggleLocation: () => void;
  uploadImages: boolean;
  toggleUploadImages: () => void;
  downloadImages: boolean;
  toggleDownloadImages: () => void;
  inspections: InspectionType[];
  updateInspection: (updatedInspection: InspectionType) => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [inspector, setInspector] = useState(false);
  const [date, setDate] = useState(false);
  const [location, setLocation] = useState(false);
  const [uploadImages, setUploadImages] = useState(false);
  const [downloadImages, setDownloadImages] = useState(false);
  const [inspections, setInspections] = useState<InspectionType[]>([]);

  const toggleInspector = () => {
    setInspector((prev) => !prev);
  };

  const toggleDate = () => {
    setDate((prev) => !prev);
  };

  const toggleLocation = () => {
    setLocation((prev) => !prev);
  };

  const toggleUploadImages = () => {
    setUploadImages((prev) => !prev);
  };

  const toggleDownloadImages = () => {
    setDownloadImages((prev) => !prev);
  };

  const updateInspection = (updatedInspection: InspectionType) => {
    setInspections((prevInspections) =>
      prevInspections.map((inspection) =>
        inspection.id === updatedInspection.id ? updatedInspection : inspection
      )
    );
  };

  return (
    <ModalContext.Provider
      value={{
        inspector,
        toggleInspector,
        date,
        toggleDate,
        location,
        toggleLocation,
        uploadImages,
        toggleUploadImages,
        downloadImages,
        toggleDownloadImages,
        inspections,
        updateInspection,
      }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;

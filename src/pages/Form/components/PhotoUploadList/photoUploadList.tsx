/* eslint-disable @typescript-eslint/no-explicit-any */
//import type { InputProps } from 'react-html-props';
import type { ImageGalleryItem, ImageListItem, InspectionConfigField } from '../../types';
import ImageGallery from './ImageGallery';
import ImageList from './ImageList';

interface PhotoUploadListProps {
  field: InspectionConfigField;
  onChange: (event: any) => void;
  saveOnClose: boolean;
  isLoading?: boolean;
  value: ImageGalleryItem[] | ImageListItem[];
}

const PhotoUploadList = ({ field, value, saveOnClose, ...props }: PhotoUploadListProps) => {
  if (field.data) {
    return <ImageGallery field={field} value={value as ImageGalleryItem[]} {...props} />;
  }
  return (
    <ImageList
      field={field}
      value={value as ImageListItem[]}
      saveOnClose={saveOnClose}
      {...props}
    />
  );
};

export default PhotoUploadList;

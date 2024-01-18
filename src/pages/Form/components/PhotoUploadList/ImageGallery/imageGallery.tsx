/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ImageGalleryItem, InspectionConfigField } from '@/pages/Form/types';
import { useCallback } from 'react';
import ImageLoaded from './ImageLoaded';
import ImageUpload from './ImageUpload';
import styles from './imageGallery.module.css';
import useWizard from '../../../hooks/useWizard';
import { useAxios } from 'library/api';
import imageCompression from 'browser-image-compression';

type ImageGalleryProps = {
  field: InspectionConfigField;
  value: ImageGalleryItem[];
  onChange: (e: any) => void;
};

const ImageGallery = ({ onChange, value, field, ...props }: ImageGalleryProps) => {
  const { id } = useWizard();
  const { api } = useAxios();
  const handleChange = useCallback(
    async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const arr = [...value];
        //onChange(arr);
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(event.target.files[0] as File, options);
        const form = new FormData();
        form.append('images', compressedFile);
        form.append('name', event.target.id);
        if (form) {
          const response = await api.post(`inspection/${id}/gallery/photo`, form);
          if (response) {
            arr[index].value = undefined;
            onChange({ imageArray: arr, action: 'save', changedImage: arr[index] });
          }
        }
      }
    },
    [onChange, value, api, id]
  );

  const handleDelete = useCallback(
    async (index: number) => {
      const arr = [...value];
      if (typeof arr[index].value === 'undefined') {
        const response = await api.delete(
          `bff/${id}/gallery/${getGalleryId(field)}/image/${arr[index].id}`
        );
        if (response) {
          arr[index].value = new File([], '');
          onChange({ imageArray: arr, action: 'delete', changedImage: arr[index] });
        }
      }
      //onChange(arr);
    },
    [onChange, value, api, id, field]
  );

  return (
    <div className={styles.gallery}>
      {value?.map((entry, index) => (
        <ImageGallerySwitch
          image={entry}
          index={index}
          field={field}
          key={entry.id}
          onChange={(event) => handleChange(index, event)}
          onDelete={() => handleDelete(index)}
          {...props}
        />
      ))}
    </div>
  );
};

export default ImageGallery;

type ImageGalleryField = {
  field: InspectionConfigField;
  image: ImageGalleryItem;
  index: number;
  onChange: (e: any) => void;
  onDelete: () => void;
};

const ImageGallerySwitch = ({ onChange, onDelete, ...props }: ImageGalleryField) => {
  const { image } = props;
  if (image.value && image.value.name === '') {
    return <ImageUpload onChange={onChange} {...props} />;
  }
  return <ImageLoaded onDelete={onDelete} {...props} />;
};

const getGalleryId = (field: InspectionConfigField) => {
  return field.addGalleryWhen ? field.addGalleryWhen.galleryId : field.galleryId;
};

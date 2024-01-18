/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ImageListItem, InspectionConfigField } from '@/pages/Form/types';
import { useCallback, useState } from 'react';
import { CameraIcon } from '@heroicons/react/24/solid';
import ModalListImage from './ModalListImage';
import ImageItem from './ImageItem';
import styles from './imageList.module.css';
import { useAxios } from 'library/api';
import useWizard from '../../../hooks/useWizard';
import imageCompression from 'browser-image-compression';

type ImageListProps = {
  field: InspectionConfigField;
  value: ImageListItem[];
  saveOnClose: boolean;
  onChange: (e: any) => void;
};

const ImageList = ({ onChange, saveOnClose, value, ...props }: ImageListProps) => {
  const [selected, setSelected] = useState<ImageListItem>();
  const [showModal, toggleModal] = useState(false);
  const { field } = props;
  const { api } = useAxios();
  const { id, getGalleriesField, updateGallery } = useWizard();
  const [loading, setLoading] = useState(false);
  const handleClose = useCallback(
    async (action: 'delete' | 'save' | 'cancel', image?: ImageListItem) => {
      if (image) {
        let index = 0;
        let arr: ImageListItem[] = [];
        const imagesStored = getGalleriesField(field.id);

        if (value) {
          arr = [...value];
          index = value.findIndex((el) => image.id === el.id);
        }
        if (action === 'delete') {
          if (index >= 0) {
            arr.splice(index, 1);
          }
          if (saveOnClose) {
            const response = await api.delete(
              `bff/${id}/gallery/${getGalleryId(field)}/image/${image.value}`
            );
            if (response) {
              const newImagesStored = imagesStored
                .map((storedImage) => {
                  return storedImage.id !== image.id ? storedImage : undefined;
                })
                .filter((image) => image);
              updateGallery(field.id, newImagesStored);
            }
          } else {
            onChange({ imageArray: arr, action, changedImage: image });
          }
          //onChange(arr);
          console.log('todo: delete image from db');
        } else if (action === 'save') {
          if (saveOnClose) {
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            };
            try {
              const compressedFile = await imageCompression(image.value as File, options);
              // console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
              const form = new FormData();
              form.append('images', compressedFile);
              if (image.description) {
                form.append('description', image.description);
                if (field.addGalleryWhen) {
                  form.append('descriptionType', field.addGalleryWhen.descriptionType);
                } else {
                  form.append('descriptionType', field.descriptionType as string);
                }
              }
              form.append('questionId', field.id);
              if (form) {
                setLoading(true);
                const response = await api.post(
                  `inspection/${id}/gallery/${getGalleryId(field)}/image`,
                  form
                );
                if (response) {
                  image.value = response.data.data.items[0].key;
                  if (index >= 0) {
                    arr[index] = image;
                  } else {
                    arr.push(image);
                  }
                  if (imagesStored) {
                    updateGallery(field.id, [...imagesStored, image]);
                  } else {
                    updateGallery(field.id, [image]);
                  }
                }
              }
              setLoading(false);
            } catch (error) {
              console.log(error);
              setLoading(false);
            }
          } else {
            if (index >= 0) {
              arr[index] = image;
            } else {
              arr.push(image);
            }
            onChange({ imageArray: arr, action, changedImage: image });
          }
          //onChange(arr);
        }
      }
      setSelected(undefined);
      toggleModal(false);
    },
    [onChange, value, saveOnClose, api, field, id, updateGallery, getGalleriesField]
  );

  const handleClick = useCallback((entry: ImageListItem) => {
    setSelected(entry);
    toggleModal(true);
  }, []);

  return (
    <div className={styles.list}>
      {value?.map((entry) => (
        <ImageItem image={entry} key={entry.id} onClick={() => handleClick(entry)} {...props} />
      ))}
      <button
        className={styles.add}
        type="button"
        onClick={() =>
          handleClick({
            id: `${value ? value.length : 0}`,
            description: undefined,
            value: undefined,
          })
        }>
        <div>
          <CameraIcon />
          Agregar Foto
        </div>
      </button>
      <ModalListImage
        field={props.field}
        selected={selected}
        isLoading={loading}
        show={showModal}
        onClose={handleClose}
      />
    </div>
  );
};

const getGalleryId = (field: InspectionConfigField) => {
  return field.addGalleryWhen ? field.addGalleryWhen.galleryId : field.galleryId;
};
export default ImageList;

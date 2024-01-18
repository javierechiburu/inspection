/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AddGalleryWhen,
  GalleryItem,
  ImageListItem,
  InspectionConfigField,
  InspectionConfigOption,
} from '@/pages/Form/types';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import Button from 'ui/button';
import Modal from 'ui/modal';
import styles from './modal-options.module.css';
import PhotoUploadList from '../../PhotoUploadList';
import Textarea from 'ui/textarea';
import useWizard from '../../../hooks/useWizard';
import { useAxios } from 'library/api';
import imageCompression from 'browser-image-compression';

const getValue = (value: any) => (value && Array.isArray(value) && value[0] !== 'ok' ? value : []);

type ModalOptionsProps = {
  field: InspectionConfigField;
  options: InspectionConfigOption[];
  onClose: (value?: string[]) => void;
  show: boolean;
  value: any;
};

const ModalOptions = ({ field, options, onClose, show, value }: ModalOptionsProps) => {
  const { getGalleriesField, updateGallery, id, getGalleriesDescription } = useWizard();

  const [arrayValue, setArrayValue] = useState<string[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>(getGalleriesField(field.id));
  const [description, setDescription] = useState<string>(getGalleriesDescription(field.id));
  const [loading, setLoading] = useState(false);
  const { api } = useAxios();
  useEffect(() => {
    setArrayValue(getValue(value));
  }, [value]);
  useEffect(() => {
    setLoading(false);
  }, [show]);
  const buttonClasses = (opt: InspectionConfigOption) => {
    const hasOption = arrayValue.includes(opt.value as string);
    return clsx(
      styles.button,
      opt.selectWhen ? styles.true : styles.false,
      opt.selectWhen && hasOption && styles['true--active'],
      !opt.selectWhen && hasOption && styles['false--active']
    );
  };

  const handleClose = async (save?: boolean) => {
    if (save) {
      setLoading(true);
      const form = await setFormData(gallery, description, field, arrayValue);
      const newImages = gallery ? gallery.filter((image) => typeof image.value !== 'string') : [];
      if (form && newImages.length !== 0) {
        const response = await api.post(
          `inspection/${id}/gallery/${getGalleryId(field)}/image`,
          form
        );
        if (response && response.data) {
          const newGalleryItem: GalleryItem[] = [];
          gallery.forEach((photo) => {
            if (typeof photo.value === 'string') {
              newGalleryItem.push(photo);
            }
          });
          const updatedGallery = [
            ...newGalleryItem,
            ...response.data.data.items.map((newPhoto: GalleryItem) => {
              return {
                id: newPhoto.id,
                value: newPhoto.key,
                tags: newPhoto.tags,
                description: newPhoto.description,
              };
            }),
          ];
          updateGallery(field.id, updatedGallery);
        }
        onClose(arrayValue);
      } else {
        onClose(arrayValue);
      }
    } else {
      const val = getValue(value);
      setArrayValue(val);
      setGallery(getGalleriesField(field.id));
      onClose();
    }
  };

  const toggleOption = useCallback(
    (opt: InspectionConfigOption) => {
      const option = arrayValue.indexOf(opt.value as string);
      if (option > -1) {
        setArrayValue((prev) => {
          const arr = [...prev];
          arr.splice(option, 1);
          return arr;
        });
      } else {
        setArrayValue((prev) => {
          return [...prev, opt.value as string];
        });
      }
    },
    [arrayValue]
  );

  const checkGalleryLogic = (rules: AddGalleryWhen) => {
    //console.log(rules);
    const contains = arrayValue.some((el) => rules.equals.includes(el));
    return contains;
  };

  const handleGalleryChange = async (element: any) => {
    const { action, imageArray, changedImage } = element;
    const imagesStored = getGalleriesField(field.id);

    if (action === 'delete') {
      //const deletedImageStored = imagesStored.find((image) => image.id === changedImage.id);
      if (typeof changedImage.value === 'string') {
        const response = await api.delete(
          `bff/${id}/gallery/${getGalleryId(field)}/image/${changedImage.value}`
        );
        if (response) {
          const newImagesStored = imagesStored
            .map((image) => {
              return image.id !== changedImage.id ? image : undefined;
            })
            .filter((image) => image);
          updateGallery(field.id, newImagesStored);
          setGallery(imageArray);
          return;
        }
      }
    }
    setGallery(imageArray);
  };

  return (
    <>
      {show ? (
        <Modal
          actions={
            <div className={styles.actions}>
              <Button
                block
                type="button"
                onClick={() => handleClose()}
                variant="secondary"
                className={styles.false}>
                Cancelar
              </Button>
              <Button
                block
                type="button"
                variant="secondary"
                disabled={arrayValue.length < 1}
                loading={loading}
                onClick={() => handleClose(true)}>
                Guardar
              </Button>
            </div>
          }
          className={styles.modal}
          onClose={() => null}
          onCloseControlled={() => handleClose()}
          open={show}
          controlled
          title={field.title}>
          <div className={styles.options}>
            {options.map((opt) => (
              <button
                className={buttonClasses(opt)}
                key={opt.value as string}
                type="button"
                onClick={() => toggleOption(opt)}>
                {opt.label}
              </button>
            ))}
          </div>
          {field.addGalleryWhen && checkGalleryLogic(field.addGalleryWhen) ? (
            <>
              <div className={styles.gallery}>
                <PhotoUploadList
                  field={field}
                  onChange={handleGalleryChange}
                  value={gallery}
                  saveOnClose={false}
                />
              </div>
              {field.addGalleryWhen?.descriptionType === 'globalDescription' ? (
                <div className={styles.description}>
                  <label>Descripcion opcional de fotos</label>
                  <Textarea
                    block
                    value={description}
                    onChange={(val) => setDescription(val.target.value)}
                  />
                </div>
              ) : null}
            </>
          ) : null}
        </Modal>
      ) : null}
    </>
  );
};

export default ModalOptions;

const getGalleryId = (field: InspectionConfigField) => {
  return field.addGalleryWhen ? field.addGalleryWhen.galleryId : field.galleryId;
};

const setFormData = async (
  imageList: ImageListItem[],
  description: string,
  field: InspectionConfigField,
  arrayValue: string[]
) => {
  if (!imageList) {
    return null;
  }
  const form = new FormData();
  if (description) {
    form.append('description', description);
    if (field.addGalleryWhen) {
      form.append('descriptionType', field.addGalleryWhen.descriptionType);
    } else {
      form.append('descriptionType', field.descriptionType as string);
    }
  }
  if (field.id) {
    form.append('questionId', field.id);
  }
  if (arrayValue) {
    arrayValue.forEach((value) => {
      form.append('tags[]', value);
    });
  }
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  const filteredImageList = imageList.filter((image) => typeof image.value !== 'string');
  for (const filteredImage of filteredImageList) {
    const compressedFile = await imageCompression(filteredImage.value as File, options);
    form.append('images', compressedFile);
  }
  return form;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ImageListItem, InspectionConfigField } from '@/pages/Form/types';
import { CameraIcon } from '@heroicons/react/24/solid';
import { useCallback, useEffect, useState } from 'react';
import { useAxios } from 'library/api';
import Button from 'ui/button';
import Modal from 'ui/modal';
import Textarea from 'ui/textarea';
import useWizard from '@/pages/Form/hooks/useWizard';
import styles from './modalListImage.module.css';

type ModalListImageProps = {
  field: InspectionConfigField;
  onClose: (action: 'delete' | 'save' | 'cancel', value?: ImageListItem) => void;
  selected?: ImageListItem;
  isLoading: boolean;
  show: boolean;
};

const ModalListImage = ({ field, selected, isLoading, show, onClose }: ModalListImageProps) => {
  const { id } = useWizard();
  const { api } = useAxios();
  const baseUrl = api.getUri();
  const [input, setInput] = useState<File | string>();
  const [description, setDescription] = useState<string>();

  useEffect(() => {
    if (selected) {
      setInput(selected.value);
      setDescription(selected.description);
    } else {
      setInput(undefined);
      setDescription(undefined);
    }
  }, [selected]);

  const handleClose = (action: 'delete' | 'save' | 'cancel') => {
    if (selected) {
      const item = { id: selected.id, description, value: input };
      switch (action) {
        case 'delete':
          onClose('delete', item);
          break;
        case 'save':
          onClose('save', item);
          break;
        default:
          onClose('cancel');
          break;
      }
    }
  };

  const handleChange = (event: any) => {
    switch (event.target.id) {
      case 'description':
        setDescription(event.target.value);
        break;
      case 'input':
        if (event.target.files && event.target.files[0]) {
          setInput(event.target.files[0]);
        }
        break;
      default:
        break;
    }
  };

  const isValid = useCallback(() => {
    if (selected) {
      return (selected.value === input && selected.description === description) || !input;
    }
    return false;
  }, [description, input, selected]);

  return (
    <>
      {show && selected ? (
        <Modal
          actions={
            <div className={styles.actions}>
              {typeof selected.value === 'undefined' ? (
                <Button
                  block
                  type="button"
                  onClick={() => handleClose('cancel')}
                  variant="secondary">
                  Cancelar
                </Button>
              ) : (
                <Button
                  block
                  type="button"
                  onClick={() => handleClose('delete')}
                  variant="secondary">
                  Eliminar
                </Button>
              )}
              <Button
                block
                type="button"
                variant="secondary"
                disabled={isValid()}
                onClick={() => handleClose('save')}
                loading={isLoading}>
                Guardar
              </Button>
            </div>
          }
          className={styles.modal}
          onClose={() => null}
          onCloseControlled={() => handleClose('cancel')}
          open={!!selected}
          controlled
          title={field.title}>
          <div className={styles.container}>
            {selected.value ? (
              <div className={styles.image}>
                <div className={styles.loading}>Cargando...</div>
                {input && typeof input !== 'string' ? (
                  <img src={URL.createObjectURL(input)} alt={selected.id} />
                ) : (
                  <img
                    src={`${baseUrl}inspection/${id}/image/${selected.value}?width=640`}
                    alt={selected.id}
                  />
                )}
              </div>
            ) : (
              <>
                <input id="input" hidden type="file" accept="image/*" onChange={handleChange} />
                {input ? (
                  <label className={styles.current} htmlFor="input">
                    <img src={URL.createObjectURL(input as File)} alt={selected.id} />
                  </label>
                ) : (
                  <label className={styles.input} htmlFor="input">
                    <div>
                      <CameraIcon />
                      Cargar Foto
                    </div>
                  </label>
                )}
              </>
            )}
          </div>
          {field.descriptionType === 'itemDescription' ? (
            <Textarea block id="description" onChange={handleChange} value={description} />
          ) : null}
        </Modal>
      ) : null}
    </>
  );
};

export default ModalListImage;

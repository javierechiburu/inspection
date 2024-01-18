import Modal from 'ui/modal';
import type { InspectionType } from '../../types';
import styles from './modal-upload-images.module.css';
import { useState, useEffect } from 'react';
import Button from 'ui/button';
import Textarea from 'ui/textarea';
import { useApi } from 'library/api';
import useAlerts from '../../hooks/useAlert';

type ModalUploadImagesProps = {
  data: InspectionType;
  open: boolean;
  onClose: () => void;
};

const ActionList = ({
  dataInspection,
  onClose,
}: {
  dataInspection: InspectionType;
  onClose: () => void;
}) => {
  const [triggerPatch, setTriggerPatch] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [description, setDescription] = useState('');
  const [formData, setFormData] = useState<FormData>();
  const { showAlert, showConfirmationModal, hideConfirmationModal } = useAlerts();

  const { data } = useApi<InspectionType>(
    `/inspection/${dataInspection.id}/gallery/b2c/image`,
    'POST',
    formData,
    null,
    triggerPatch
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value) {
      setDescription(event.target.value);
    }
  };

  function handleSubmit() {
    showConfirmationModal(
      () => {
        const form = new FormData();
        form.append('description', description);
        form.append('descriptionType', 'globalDescription');
        if (selectedFiles != null) {
          Array.from(selectedFiles).forEach((file) => {
            form.append('images', file);
          });
        }
        setFormData(form);
        setTriggerPatch(true);
        hideConfirmationModal();
      },
      () => {
        // Manejar la cancelación
      }
    );
  }

  useEffect(() => {
    if (triggerPatch) {
      if (data) {
        onClose();
        setTriggerPatch(false);
        showAlert('Fotos cargadas con éxito', 'success');
      }
    }
  }, [data, triggerPatch, onClose, showAlert]);

  return (
    <div className={styles.list}>
      <input type="file" multiple onChange={handleFileChange} accept="image/*" />
      <Textarea
        className={styles.margin}
        placeholder="descripcion"
        onChange={handleDescriptionChange}
      />
      <Button
        className={styles.margin}
        size="large"
        onClick={handleSubmit}
        variant="secondary"
        loading={triggerPatch}>
        Guardar
      </Button>
    </div>
  );
};

const ModalUploadImages = ({ data, open, onClose }: ModalUploadImagesProps) => {
  const { confirmationModal } = useAlerts();

  const handleClose = () => {
    if (!confirmationModal.show) {
      onClose();
    }
  };

  return (
    <Modal
      actions={<ActionList dataInspection={data} onClose={handleClose} />}
      className={styles.panel}
      open={open}
      onClose={handleClose}
      title="Subir Fotos"
      description={`.....`}
    />
  );
};

export default ModalUploadImages;

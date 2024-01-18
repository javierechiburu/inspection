import { useState, ChangeEvent, useEffect } from 'react';
import Modal from 'ui/modal';
import type { InspectionType } from '../../types';
import styles from './modal-location.module.css';
import Button from 'ui/button';
import TextInput from 'ui/textInput';
import { useApi } from 'library/api';
import useAlerts from '../../hooks/useAlert';

type ModalDirectionProps = {
  data: InspectionType;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedData: InspectionType) => void;
};

const ActionList = ({
  dataInspection,
  onClose,
  onUpdate,
}: {
  dataInspection: InspectionType;
  onClose: () => void;
  onUpdate: (updatedData: InspectionType) => void;
}) => {
  const [direction, setDirection] = useState<string>('');
  const [triggerPatch, setTriggerPatch] = useState(false);
  const { showAlert } = useAlerts();

  const { data } = useApi<InspectionType>(
    `/inspection/${dataInspection.id}/location`,
    'PATCH',
    {},
    '',
    triggerPatch
  );

  const handleDirectionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDirection(e.target.value);
  };

  const handleSubmit = () => {
    if (direction) {
      setTriggerPatch(true);
    }
  };

  useEffect(() => {
    if (triggerPatch) {
      if (data) {
        dataInspection.scheduled = direction;
        onUpdate(dataInspection);
        onClose();
        setTriggerPatch(false);
        showAlert('Direccion asignada con éxito', 'success');
      }
    }
  }, [data, triggerPatch, onClose, onUpdate, dataInspection, direction, showAlert]);

  return (
    <div className={styles.list}>
      <TextInput onChange={handleDirectionChange} />
      <Button className={styles.margin} size="large" onClick={handleSubmit} variant="secondary">
        Guardar
      </Button>
    </div>
  );
};

const ModalLocation = ({ data, open, onClose, onUpdate }: ModalDirectionProps) => {
  return (
    <Modal
      actions={<ActionList dataInspection={data} onClose={onClose} onUpdate={onUpdate} />}
      className={styles.panel}
      open={open}
      onClose={onClose}
      title="Cambiar Dirección"
      description={`.....`}
    />
  );
};

export default ModalLocation;

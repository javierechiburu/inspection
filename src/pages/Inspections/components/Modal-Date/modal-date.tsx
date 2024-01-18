import { useState, ChangeEvent, useEffect } from 'react';
import Modal from 'ui/modal';
import type { InspectionType } from '../../types';
import styles from './modal-date.module.css';
import Button from 'ui/button';
import DateInput from 'ui/dateInput';
import { useApi } from 'library/api';
import useAlerts from '../../hooks/useAlert';

type ModalDateProps = {
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
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [triggerPatch, setTriggerPatch] = useState(false);
  const { showAlert } = useAlerts();

  const { data } = useApi<InspectionType>(
    `/inspection/${dataInspection.id}/appointment`,
    'PATCH',
    { inspectionDate: date, inspectionTime: time },
    '',
    triggerPatch
  );

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setDateTime(newDate);
  };

  const handleSubmit = () => {
    if (dateTime) {
      const formattedDate = formatDateString(dateTime);
      const formattedTime = formatTimeString(dateTime);
      setDate(formattedDate);
      setTime(formattedTime);
      setTriggerPatch(true);
    }
  };

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeString = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (triggerPatch) {
      if (data) {
        dataInspection.scheduled = date + ' ' + time;
        onUpdate(dataInspection);
        onClose();
        setTriggerPatch(false);
        showAlert('¡Fotos subidas exitosamente!', 'success');
      }
    }
  }, [data, triggerPatch, onClose, onUpdate, dataInspection, date, time, showAlert]);

  return (
    <div className={styles.list}>
      <DateInput onChange={handleDateChange} time={true} />
      <Button className={styles.margin} size="large" onClick={handleSubmit} variant="secondary">
        Guardar
      </Button>
    </div>
  );
};

const ModalDate = ({ data, open, onClose, onUpdate }: ModalDateProps) => {
  return (
    <Modal
      actions={<ActionList dataInspection={data} onClose={onClose} onUpdate={onUpdate} />}
      className={styles.panel}
      open={open}
      onClose={onClose}
      title="Cambiar Fecha"
      description={`.....`}
    />
  );
};

export default ModalDate;

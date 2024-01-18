import Modal from 'ui/modal';
import type { InspectionType } from '../../types';
import styles from './modal-inspector.module.css';
import { useState, useEffect } from 'react';
import Button from 'ui/button';
import Select from 'ui/select';
import { useApi } from 'library/api';
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';
import useAlerts from '../../hooks/useAlert';

type ModalInspectorProps = {
  data: InspectionType;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedData: InspectionType) => void;
};

interface optionInterface {
  value: string;
  label: string;
}

interface InspectorValues {
  id?: string;
  name?: string;
}

interface filterOptions {
  inspectors: Array<optionInterface>;
}

const ActionList = ({
  dataInspection,
  onClose,
  onUpdate,
}: {
  dataInspection: InspectionType;
  onClose: () => void;
  onUpdate: (updatedData: InspectionType) => void;
}) => {
  const [inspector, setInspector] = useState<InspectorValues>({});
  const [options, setOptions] = useState<filterOptions>({ inspectors: [] });
  const [triggerPatch, setTriggerPatch] = useState(false);
  const { showAlert, showConfirmationModal, hideConfirmationModal } = useAlerts();
  const { data } = useApi<InspectionType>(
    `/inspection/${dataInspection.id}/inspector`,
    'PATCH',
    { inspectorId: inspector.id, inspectorName: inspector.name },
    inspector,
    triggerPatch
  );

  const { data: res } = useApi<filterOptions>('bff/filters?company=OLX', 'get', null);

  function handleSubmit() {
    if (inspector.id && inspector.name) {
      showConfirmationModal(
        () => {
          setTriggerPatch(true);
          hideConfirmationModal();
        },
        () => {
          // Manejar la cancelación
        }
      );
    }
  }

  useEffect(() => {
    if (triggerPatch) {
      if (data && inspector.id && inspector.name) {
        dataInspection.user.name = inspector.name || dataInspection.user.name;
        dataInspection.user.id = parseInt(inspector.id) || dataInspection.user.id;
        onUpdate(dataInspection);
        setTriggerPatch(false);
        onClose();
        showAlert('Inspector asignado con éxito', 'success');
      }
    }
  }, [data, triggerPatch, dataInspection, onUpdate, onClose, showAlert, inspector]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = event.target.value;
    const selectedOption = options.inspectors.find((option) => option.value === selectedId);
    if (selectedOption) {
      const option = { id: selectedOption.value, name: selectedOption.label };
      setInspector(option);
    }
  };

  useEffect(() => {
    if (res) {
      const selectOptions: filterOptions = {
        inspectors: res.inspectors ?? [],
      };
      setOptions(selectOptions);
    }
  }, [res]);

  return (
    <div className={styles.list}>
      <Select
        className={styles['input--x2']}
        icon={<BuildingOfficeIcon />}
        onChange={handleFilterChange}
        options={options.inspectors}
        placeholder="Inspector..."
        value={inspector.id || null}
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

const ModalInspector = ({ data, open, onClose, onUpdate }: ModalInspectorProps) => {
  const { confirmationModal } = useAlerts();
  const handleClose = () => {
    if (!confirmationModal.show) {
      onClose();
    }
  };
  return (
    <Modal
      actions={<ActionList dataInspection={data} onClose={handleClose} onUpdate={onUpdate} />}
      className={styles.panel}
      open={open}
      onClose={handleClose}
      title="Asignar Inspector"
      description={`.....`}
    />
  );
};

export default ModalInspector;

import Button from 'ui/button';
import Modal from 'ui/modal';
import type { InspectionType } from '../../types';
import styles from './actions.module.css';
import getActions from '../../functions/getActions';
import { useAuth } from 'library/authentication';

type ActionsProps = {
  data: InspectionType;
  open: boolean;
  onClose: () => void;
  toggleFunctions: Record<string, () => void>;
};

const ActionList = ({
  onClose,
  toggleFunctions,
  data,
}: {
  onClose: () => void;
  toggleFunctions: Record<string, () => void>;
  data: InspectionType;
}) => {
  const { getRoles } = useAuth();

  const actions = getActions(toggleFunctions, getRoles(), data)[0];
  return (
    <div className={styles.list}>
      {actions.map((action) => (
        <Button size="large" key={action.key} onClick={action.onClick}>
          {action.label}
        </Button>
      ))}
      <Button size="large" onClick={() => onClose()} variant="secondary">
        Cerrar
      </Button>
    </div>
  );
};

const Actions = ({ data, open, onClose, toggleFunctions }: ActionsProps) => {
  return (
    <Modal
      actions={<ActionList onClose={onClose} toggleFunctions={toggleFunctions} data={data} />}
      className={styles.panel}
      open={open}
      onClose={onClose}
      title="ACCIONES"
      description={`${data.plate} ${data.brand} ${data.model} ${data.year}`}
    />
  );
};

export default Actions;

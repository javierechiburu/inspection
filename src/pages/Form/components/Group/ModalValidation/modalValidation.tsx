import type { NotAnsweredField } from '@/pages/Form/types';
import Button from 'ui/button';
import Modal from 'ui/modal';
import styles from './modalValidation.module.css';

type ModalValidationProps = {
  data?: NotAnsweredField[];
  isComplete?: boolean;
  onClose: () => void;
  onContinue: () => void;
};

const ModalValidation = ({ data, onClose, onContinue, isComplete }: ModalValidationProps) => {
  return (
    <>
      {data ? (
        <Modal
          actions={
            <div className={styles.actions}>
              <Button block variant="secondary" type="button" onClick={() => onClose()}>
                Cerrar
              </Button>
              <Button block variant="primary" type="button" onClick={() => onContinue()}>
                Continuar
              </Button>
            </div>
          }
          className={styles.modal}
          onClose={() => null}
          onCloseControlled={() => onClose()}
          open={!!data}
          controlled
          title="Atención">
          <p>Los siguientes campos requeridos, no han sido completados:</p>
          <ul className={styles.list}>
            {data.map((field) => (
              <li key={field.question}>
                {isComplete ? `${field.questionTitle} - ${field.section}` : field.questionTitle}
              </li>
            ))}
          </ul>
        </Modal>
      ) : null}
    </>
  );
};

export default ModalValidation;

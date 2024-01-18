import { useContext } from 'react';
import { ModalContext } from '../contexts/modalContext';

const useModals = () => {
  const modalContext = useContext(ModalContext);

  if (!modalContext) {
    throw new Error('useModals has to be used within <ModalProvider>');
  }

  return modalContext;
};

export default useModals;

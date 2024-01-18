import { useContext } from 'react';
import { AlertContext } from 'ui/alertContext';

const useAlerts = () => {
  const alertContext = useContext(AlertContext);

  if (!alertContext) {
    throw new Error('useAlerts has to be used within <AlertProvider>');
  }

  return alertContext;
};

export default useAlerts;

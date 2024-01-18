import { useContext } from 'react';
import WizardContext from '../contexts/wizard.context';

const useWizard = () => {
  const wizardContext = useContext(WizardContext);

  if (!wizardContext) {
    throw new Error('useWizard has to be used within <WizardProvider>');
  }

  return wizardContext;
};

export default useWizard;

import Button from 'ui/button';
import useWizard from '../../hooks/useWizard';

const Actions = () => {
  const { saveDraft } = useWizard();

  const handleClick = async () => {
    saveDraft('draft');
  };

  return (
    <Button onClick={handleClick} variant="primary">
      Guardar
    </Button>
  );
};

export default Actions;

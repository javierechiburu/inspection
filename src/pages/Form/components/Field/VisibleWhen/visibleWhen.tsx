import type { FieldProps } from '@/pages/Form/types';
import { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import useWizard from '../../../hooks/useWizard';

const VisibleWhen = ({
  children,
  control,
  field,
  onChange,
}: FieldProps & { children: React.ReactNode }) => {
  const { getField } = useWizard();
  //Watch no considera los registros que están en otra sección, por ende se tuvo que buscar en las respuestas
  const watch = useWatch({ control, name: field.visibleWhen?.id || '' });
  const [visible, setVisible] = useState<boolean>(watch);
  const fieldsAnswered = getField(field.visibleWhen?.id || '');
  useEffect(() => {
    if (field.visibleWhen) {
      if (field.visibleWhen.equals) {
        if (Array.isArray(field.visibleWhen?.value)) {
          setVisible(field.visibleWhen.value.includes(fieldsAnswered));
        } else if (typeof fieldsAnswered === 'boolean') {
          setVisible(fieldsAnswered);
        } else {
          if (
            fieldsAnswered !== 'undefined' &&
            fieldsAnswered !== '' &&
            fieldsAnswered === field.visibleWhen.equals
          ) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        }
      } else if (field.visibleWhen.notIn) {
        //Checkea la validación específica del visibleWhen
        const notInValidation = !field.visibleWhen.notIn.includes(fieldsAnswered);
        //Checkea que el campo deba estar respondido, si no, al estar vacío lo tomará como correcto
        if (notInValidation && typeof watch !== 'undefined' && fieldsAnswered !== '') {
          setVisible(true);
        } else {
          setVisible(false);
        }
      } else if (field.visibleWhen.in) {
        setVisible(field.visibleWhen.in.includes(fieldsAnswered));
      }
    }
  }, [field.visibleWhen, watch, visible, fieldsAnswered]);

  useEffect(() => {
    if (!visible && fieldsAnswered === '' && watch !== '') {
      onChange({ target: { value: '', name: field.id } });
    }
  }, [field.id, fieldsAnswered, visible, watch, onChange]);

  if (!visible) return null;

  return <>{children}</>;
};

export default VisibleWhen;

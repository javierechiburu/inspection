/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldProps } from '../../types';
import useWizard from '../../hooks/useWizard';
import Component from './Component';
import VisibleWhen from './VisibleWhen';
import Wrapper from './Wrapper';
import styles from './field.module.css';

const Field = (props: FieldProps) => {
  const { updateField } = useWizard();
  const { field, setValue, regex, isRequired, value } = props;
  const fieldProps = { ...props };

  if (field.update) {
    fieldProps.onChange = (e: any) => {
      field.update?.forEach((el) => {
        setValue(el, undefined);
        updateField(el, undefined);
      });
      props.onChange(e);
    };
  }
  let regexPattern: RegExp | null = null;

  if (typeof regex === 'string' && regex.trim() !== '') {
    regexPattern = new RegExp(regex);
  }
  const regexValid = regexPattern ? regexPattern.test(value) : true;
  const isFilled = isRequired ? value !== '' && value !== null : true;
  const isValidField = regexValid && isFilled;

  return (
    <>
      {field.visibleWhen ? (
        <VisibleWhen {...fieldProps}>
          <Wrapper {...fieldProps}>
            <div>
              <Component {...fieldProps} />
            </div>

            {!isValidField && <span>error</span>}
          </Wrapper>
        </VisibleWhen>
      ) : (
        <Wrapper {...fieldProps}>
          <div className={!isValidField ? styles.errorField : ''}>
            <Component {...fieldProps} />
          </div>
          {!isValidField && <span>error</span>}
        </Wrapper>
      )}
    </>
  );
};

export default Field;

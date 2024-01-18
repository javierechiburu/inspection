/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InputProps } from 'react-html-props';
import clsx from 'clsx';
import styles from './thumbSwitchNA.module.css';
import { InspectionConfigField } from '@/pages/Form/types';
import { useCallback } from 'react';

interface ThumbSwitchNAProps extends InputProps {
  block?: boolean;
  field: InspectionConfigField;
  onChange?: (e: any) => void;
  value: any;
}

const ThumbSwitchNA = ({ block, className, field, ...props }: ThumbSwitchNAProps) => {
  const { value } = props;

  const wrapperClasses = clsx(styles.wrapper, block && styles['wrapper--block'], className);

  const handleClick = (value: string) => {
    if (props.onChange) {
      props.onChange({ target: { value: value, name: field.id } });
    }
  };

  const getBaseClass = useCallback(
    (val: string) => {
      const notSelected: boolean = value && value !== val;
      switch (val) {
        case 'ok':
          return clsx(
            styles.ok,
            value === val && styles['ok--active'],
            notSelected && styles.notSelected
          );
        case 'notOk':
          return clsx(
            styles.notOk,
            value === val && styles['notOk--active'],
            notSelected && styles.notSelected
          );
        default:
          return clsx(
            styles.na,
            value === val && styles['na--active'],
            notSelected && styles.notSelected
          );
      }
    },
    [value]
  );

  const buttonClasses = (val: string) => clsx(styles.button, getBaseClass(val));

  return (
    <div className={wrapperClasses}>
      <input type="hidden" name={field.id} {...props} />
      <button
        className={buttonClasses('ok')}
        disabled={value === 'ok'}
        type="button"
        onClick={() => handleClick('ok')}>
        {field.label1 || 'Bien'}
      </button>
      <button
        className={buttonClasses('notOk')}
        disabled={value === 'notOk'}
        type="button"
        onClick={() => handleClick('notOk')}>
        {field.label2 || 'Mal'}
      </button>
      <button
        className={buttonClasses('notApply')}
        disabled={value === 'notApply'}
        type="button"
        onClick={() => handleClick('notApply')}>
        N/A
      </button>
    </div>
  );
};

export default ThumbSwitchNA;

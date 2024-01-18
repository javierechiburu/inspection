/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InputProps } from 'react-html-props';
import clsx from 'clsx';
import styles from './thumbSwitch.module.css';
import { useCallback } from 'react';
import { InspectionConfigField } from '@/pages/Form/types';

interface ThumbSwitchProps extends InputProps {
  block?: boolean;
  field: InspectionConfigField;
  onChange: (e: any) => void;
  value: any;
}

const ThumbSwitch = ({ block, className, field, ...props }: ThumbSwitchProps) => {
  const { value } = props;

  const wrapperClasses = clsx(styles.wrapper, block && styles['wrapper--block'], className);

  const handleClick = (value: boolean) => {
    props.onChange({ target: { value: value, name: field.id } });
  };

  const buttonClasses = useCallback(
    (val: boolean) =>
      clsx(
        styles.button,
        val ? styles.true : styles.false,
        val && value && styles['true--active'],
        typeof value === 'boolean' && !val && !value && styles['false--active'],
        typeof value === 'boolean' && value !== val && styles.notSelected
      ),
    [value]
  );

  return (
    <div className={wrapperClasses}>
      <input type="hidden" name={field.id} {...props} />
      <button className={buttonClasses(true)} type="button" onClick={() => handleClick(true)}>
        {field.label1 || 'Bien'}
      </button>
      <button className={buttonClasses(false)} type="button" onClick={() => handleClick(false)}>
        {field.label2 || 'Mal'}
      </button>
    </div>
  );
};

export default ThumbSwitch;

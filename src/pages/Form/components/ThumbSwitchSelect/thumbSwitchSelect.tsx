/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InputProps } from 'react-html-props';
import type { InspectionConfigField, InspectionConfigOption } from '@/pages/Form/types';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import ThumbSwitch from '../ThumbSwitch';
import styles from './thumbSwitchSelect.module.css';

interface ThumbSwitchSelectProps extends InputProps {
  block?: boolean;
  field: InspectionConfigField;
  onChange?: (e: any) => void;
  value: any;
}

const ThumbSwitchSelect = ({
  block,
  className,
  field,
  onChange,
  value,
}: ThumbSwitchSelectProps) => {
  const [switchValue, setSwitchValue] = useState<boolean | string | undefined>(
    getSwitchValue(value)
  );
  const [options, setOptions] = useState<InspectionConfigOption[]>([]);

  useEffect(() => {
    if (typeof switchValue === 'boolean' && field.options) {
      let arr = [];
      if (switchValue) {
        arr = field.options.filter((opt) => opt.selectWhen);
      } else {
        arr = field.options.filter((opt) => !opt.selectWhen);
      }
      setOptions(arr);
    }
  }, [field.options, switchValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = !!e.target.value;
    if (val) {
      setSwitchValue(true);
      if (onChange) {
        let arr: InspectionConfigOption[] = [];
        if (field.options) {
          arr = field.options.filter((opt) => opt.selectWhen);
        }
        onChange({ target: { value: arr[0]?.value, name: field.id } });
      }
    } else {
      setSwitchValue(false);
      if (field.options && onChange) {
        const arr = field.options.filter((opt) => !opt.selectWhen);
        if (arr.length < 2) {
          onChange({ target: { value: arr[0].value, name: field.id } });
        }
      }
    }
  };

  const handleClick = (option: InspectionConfigOption) => {
    if (onChange) {
      onChange({ target: { value: option.value, name: field.id } });
    }
  };

  const wrapperClasses = clsx(styles.wrapper, block && styles['wrapper--block'], className);

  const buttonClasses = (opt: InspectionConfigOption) =>
    clsx(
      styles.button,
      opt.selectWhen ? styles.true : styles.false,
      opt.selectWhen && opt.value === value && styles['true--active'],
      !opt.selectWhen && opt.value === value && styles['false--active']
    );

  return (
    <div className={wrapperClasses}>
      <ThumbSwitch block field={field} onChange={handleChange} value={switchValue} />
      {options.length > 1 ? (
        <div className={styles.options}>
          {options.map((option) => (
            <button
              className={buttonClasses(option)}
              key={option.value}
              type="button"
              onClick={() => handleClick(option)}>
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ThumbSwitchSelect;

const getSwitchValue = (value: any) => {
  //cambiar esto para extender la lógica, fix rápido para UAT
  if (typeof value === 'string' && value === '') return value;
  if (typeof value === 'string' && value === 'notPresent') return false;
  return !!value;
};

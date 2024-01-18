/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InputProps } from 'react-html-props';
import type { InspectionConfigField, InspectionConfigOption, Report } from '@/pages/Form/types';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ThumbSwitch from '../ThumbSwitch';
import ModalOptions from './Modal-Options';
import styles from './thumbSwitchMultiSelect.module.css';
import useWizard from '../../hooks/useWizard';
import { useAxios } from 'library/api';

interface ThumbSwitchMultiSelectProps extends InputProps {
  block?: boolean;
  field: InspectionConfigField;
  onChange: (e: any) => void;
  value: any;
}

const ThumbSwitchMultiSelect = ({
  block,
  className,
  field,
  onChange,
  value,
}: ThumbSwitchMultiSelectProps) => {
  const [modal, toggleModal] = useState(false);
  const [switchValue, setSwitchValue] = useState<boolean | string>(getSwitchValue(value));
  const [options, setOptions] = useState<InspectionConfigOption[]>([]);
  const [modalOptionsValue, setModalOptionsValue] = useState<string[]>(value);
  const { fields, id } = useWizard();
  const { api } = useAxios();
  const trueOptions = useMemo(() => {
    return field.options ? field.options.filter((opt) => opt.selectWhen) : [];
  }, [field.options]);
  useEffect(() => {
    setModalOptionsValue(value);
  }, [value, setModalOptionsValue]);

  const falseOptions = useMemo(() => {
    return field.options ? field.options.filter((opt) => !opt.selectWhen) : [];
  }, [field.options]);

  useEffect(() => {
    if (typeof switchValue === 'string') {
      setOptions([]);
    } else {
      switchValue ? setOptions(trueOptions) : setOptions(falseOptions);
    }
  }, [falseOptions, switchValue, trueOptions]);

  if (options.length === 0 && falseOptions.length != 0) {
    setOptions(falseOptions);
  }

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = !!e.target.value;

    if (val) {
      if (!switchValue) {
        setSwitchValue(true);
        if (trueOptions.length === 1) {
          setModalOptionsValue([trueOptions[0].value as string]);
          onChange({ target: { value: [trueOptions[0].value], name: field.id } });
        }
      }
      if (trueOptions.length > 1) {
        toggleModal(true);
      }
    } else {
      if (switchValue || typeof switchValue === 'string') {
        setModalOptionsValue([]);
        setSwitchValue(false);
        if (falseOptions.length === 1) {
          onChange({ target: { value: [falseOptions[0]], name: field.id } });
        }
      }
      if (falseOptions.length > 1) {
        toggleModal(true);
      }
    }
  };

  const handleOptionsClose = useCallback(
    async (opts?: string[]) => {
      if (opts) {
        if (JSON.stringify(opts) !== JSON.stringify(modalOptionsValue)) {
          onChange({ target: { value: opts, name: field.id } });
          const report: Report = {};
          Object.keys(fields).forEach((questionId) => {
            if (fields[questionId] !== '' && questionId !== 'photos') {
              report[questionId] = fields[questionId];
            }
          });
          report[field.id] = opts;
          const saveInspectionResponse = await api.patch(`/bff/inspection/${id}/draft`, { report });
          //refinar lógica, es para evitar envíos al backend si solo se mueven por las pestañas sin hacer nada
        }
      } else {
        if (!Array.isArray(modalOptionsValue) || modalOptionsValue.length == 0) setSwitchValue('');
      }
      toggleModal(false);
    },
    [field.id, onChange, modalOptionsValue, fields, api, id]
  );

  const showTags = useCallback(() => {
    const isArray = Array.isArray(modalOptionsValue);
    if (isArray) {
      if (
        (switchValue && trueOptions.length > 1) ||
        modalOptionsValue.length > 1 ||
        (modalOptionsValue.length > 0 && modalOptionsValue[0] !== 'ok')
      )
        return true;
      if (typeof switchValue === 'boolean' && switchValue === false && falseOptions.length > 1)
        return true;
    }
    return false;
  }, [falseOptions.length, switchValue, trueOptions.length, modalOptionsValue]);

  const getTagLabel = (tag: string) => {
    if (switchValue) {
      return trueOptions.find((el) => el.value === tag)?.label;
    }
    if (typeof switchValue === 'boolean' && switchValue === false) {
      return falseOptions.find((el) => el.value === tag)?.label;
    }
  };

  const wrapperClasses = clsx(styles.wrapper, block && styles['wrapper--block'], className);

  return (
    <div className={wrapperClasses}>
      <ThumbSwitch block field={field} onChange={handleSwitchChange} value={switchValue} />
      {showTags() ? (
        <div className={styles.tags}>
          {modalOptionsValue.map((el: string) => (
            <span key={el} className={styles.tag}>
              {getTagLabel(el)}
            </span>
          ))}
        </div>
      ) : null}
      <ModalOptions
        field={field}
        show={modal}
        onClose={handleOptionsClose}
        options={options}
        value={modalOptionsValue}
      />
    </div>
  );
};

export default ThumbSwitchMultiSelect;

const getSwitchValue = (value: any) => {
  if (!value) return value;
  return value.includes('ok') ? true : false;
};

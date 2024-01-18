/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InspectionConfigField, InspectionConfigGroup, NotAnsweredField } from '../../types';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Panel from 'ui/panel';
import Button from 'ui/button';
import useWizard from '../../hooks/useWizard';
import Field from '../Field';
import ModalValidation from './ModalValidation';
import styles from './group.module.css';
type GroupProps = {
  group: InspectionConfigGroup;
  index: number;
  total: number;
};

const Group = ({ group, index, total }: GroupProps) => {
  const [validation, setValidation] = useState<NotAnsweredField[]>();
  const { step, changeStep, updateField, fields, checkRequiredFields, saveDraft, id } = useWizard();
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: fields,
  });
  const [stepAux, setStepAux] = useState(step);
  const [isEndingButton, setIsEndingButton] = useState(false);
  const navigate = useNavigate();

  if (step !== index) return;

  const handleChange = async (
    question: InspectionConfigField,
    value: any,
    onChange: (...event: any[]) => void
  ) => {
    let dataValue = value;
    if (value.target) {
      dataValue = value.target?.value;
      if (typeof dataValue === 'string' && question.forceUppercaseInput) {
        dataValue = dataValue.toUpperCase();
      }
    }

    if (question.regex) {
      const regexPattern =
        typeof question.regex === 'string' ? new RegExp(question.regex) : question.regex;
      if (!regexPattern.test(dataValue)) {
        updateField(question.id, '');
      } else {
        updateField(question.id, dataValue);
      }
    } else {
      updateField(question.id, dataValue);
    }

    onChange(dataValue);
  };

  const handleCompleteInspection = async () => {
    const notAnsweredArray = checkRequiredFields(null);
    if (notAnsweredArray.length !== 0) {
      setValidation(notAnsweredArray);
      setIsEndingButton(true);
    } else {
      const response = await saveDraft('save');
      if (response != null) {
        navigate(`/inspecciones/${id}`);
      }
    }
  };

  const moveStep = (to: number) => {
    saveDraft('draft');
    changeStep(to);
  };

  const isDisabled = () => {
    const notAnsweredArray = checkRequiredFields(null);
    return !(notAnsweredArray.length === 0);
  };

  const handleMove = (groupId: string, to: number) => () => {
    const notAnsweredArray = checkRequiredFields(groupId);
    if (notAnsweredArray.length > 0) {
      setStepAux(to);
      setValidation(notAnsweredArray);
    } else {
      moveStep(to);
    }
  };

  const handleValidationContinue = () => {
    setValidation(undefined);
  };

  const handleValidationClose = () => {
    setValidation(undefined);
    //const element = document.getElementById('main');
    /* if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } */
    if (!isEndingButton) {
      moveStep(stepAux);
    } else {
      setIsEndingButton(false);
    }
  };

  /*const handleCompleteInspection = async () => {
    const notAnsweredArray = checkRequiredFields();
    if (notAnsweredArray.length !== 0) {
      return;
    }
    const response = await saveDraft('save');
    if (response != null) {
      navigate(`/inspecciones`);
    }
  };

  const moveStep = (to: number) => {
    saveDraft('draft');
    changeStep(to);
  };

  const isDisabled = () => {
    const notAnsweredArray = checkRequiredFields();
    console.log(notAnsweredArray);
    return !(notAnsweredArray.length === 0);
  };*/

  return (
    <Panel className={styles.group} id={group.id}>
      <h3 className={styles.title}>
        <span>
          {index + 1}/{total}
        </span>
        {group.title}
      </h3>
      <form onSubmit={handleSubmit(() => moveStep(index + 1))}>
        <div className={clsx(styles.container, group.id === 'photos' && styles.gallery)}>
          {group.data.map((entry) => (
            <Controller
              key={entry.id}
              name={entry.id}
              defaultValue={fields[entry.id]}
              control={control}
              render={({ field: { onBlur, onChange, value } }) => (
                <Field
                  control={control}
                  field={entry}
                  regex={entry.regex}
                  isRequired={entry.required}
                  onBlur={onBlur}
                  onChange={(event: any) => handleChange(entry, event, onChange)}
                  setValue={setValue}
                  value={value}
                />
              )}
            />
          ))}
        </div>
        <div className={styles.actions}>
          {index !== 0 ? (
            <Button type="button" variant="primary" onClick={handleMove(group.id, index - 1)}>
              Anterior
            </Button>
          ) : null}
          {index == total - 1 ? (
            <Button
              type="button"
              variant="primary"
              disabled={isDisabled()}
              onClick={handleSubmit(handleCompleteInspection)}>
              Finalizar
            </Button>
          ) : (
            <Button type="button" variant="primary" onClick={handleMove(group.id, index + 1)}>
              Siguiente
            </Button>
          )}
        </div>
      </form>
      <ModalValidation
        data={validation}
        onClose={handleValidationContinue}
        onContinue={handleValidationClose}
        isComplete={isEndingButton}
      />
    </Panel>
  );
};

export default Group;

import clsx from 'clsx';
import useWizard from '../../hooks/useWizard';
import type { InspectionConfigGroup } from '../../types';
import styles from './link.module.css';

type LinkProps = {
  group: InspectionConfigGroup;
  index: number;
};

const Link = ({ group, index }: LinkProps) => {
  const { changeStep, step } = useWizard();
  const buttonClasses = clsx(styles.button, step === index && styles.active);

  return (
    <button
      key={group.id}
      className={buttonClasses}
      onClick={() => changeStep(index)}
      disabled={step === index}>
      <span>{index + 1}</span>
      <span>{group.title}</span>
    </button>
  );
};

export default Link;

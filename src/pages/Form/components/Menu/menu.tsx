import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import Link from '../Link';
import useWizard from '../../hooks/useWizard';
import type { InspectionConfigGroup } from '../../types';
import styles from './menu.module.css';

type MenuProps = {
  groups: InspectionConfigGroup[];
};

const Menu = ({ groups }: MenuProps) => {
  const { step, changeStep } = useWizard();
  const current = groups[step];

  return (
    <>
      <menu className={styles.mobile}>
        <button className={styles.arrow} disabled={step === 0} onClick={() => changeStep(step - 1)}>
          <ChevronLeftIcon />
        </button>
        {/* Todo: select navigation */}
        <div>{current.title}</div>
        <button
          className={styles.arrow}
          disabled={step === groups.length - 1}
          onClick={() => changeStep(step + 1)}>
          <ChevronLeftIcon />
        </button>
      </menu>
      <menu className={styles.desktop}>
        {groups.map((group, index) => (
          <Link group={group} index={index} key={group.id} />
        ))}
      </menu>
    </>
  );
};

export default Menu;

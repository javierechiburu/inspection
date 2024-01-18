import Heading from '@/components/Heading';
import List from './components/List';
import styles from './inspections.module.css';

const Inspections = () => {
  return (
    <div className={styles.wrapper}>
      <Heading title="Inspecciones" section="Inspección" description=""></Heading>
      <List />
    </div>
  );
};

export default Inspections;

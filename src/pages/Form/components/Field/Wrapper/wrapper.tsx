import { FieldProps } from '@/pages/Form/types';
import styles from './wrapper.module.css';

const Wrapper = ({ children, ...props }: React.PropsWithChildren<FieldProps>) => {
  const { field } = props;

  return (
    <div className={styles.field}>
      {field.hideLabel ? null : (
        <label>
          {field.title}
          {field.required ? <span>*</span> : null}
        </label>
      )}
      {children}
    </div>
  );
};

export default Wrapper;

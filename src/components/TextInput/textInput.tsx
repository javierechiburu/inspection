/* eslint-disable @typescript-eslint/no-unused-vars */
import clsx from 'clsx';
import type { InputProps } from 'react-html-props';
import styles from './textInput.module.css';

interface TextInputProps extends InputProps {
  block?: boolean;
  placeholder?: string;
  icon?: string;
  inputType?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput = ({ block, icon, inputType, ...props }: TextInputProps) => {
  // console.log(icon, inputType);

  const wrapperClasses = clsx(styles.wrapper, block && styles.block);

  return (
    <div className={wrapperClasses}>
      <input {...props} />
    </div>
  );
};

export default TextInput;

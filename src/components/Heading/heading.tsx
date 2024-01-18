import { HeaderProps } from 'react-html-props';
import styles from './heading.module.css';
import clsx from 'clsx';

type HeadingType = HeaderProps & {
  title: string;
  section: string;
  description: string;
};

const Heading = ({ className, title, section, description, children, ...props }: HeadingType) => {
  const classes = clsx(styles.header, className);

  return (
    <header className={classes} {...props}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.section}>{section}</p>
        <p className={styles.description}>{description}</p>
      </div>
      {children ? <div className={styles.content}>{children}</div> : null}
    </header>
  );
};

export default Heading;

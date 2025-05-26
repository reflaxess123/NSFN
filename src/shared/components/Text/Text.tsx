import { clsx } from 'clsx';
import styles from './Text.module.scss';

type TextProps = {
  text: string;
  className?: string;
};

export const Text = ({ text, className }: TextProps) => {
  return <div className={clsx(styles.text, className)}>{text}</div>;
};

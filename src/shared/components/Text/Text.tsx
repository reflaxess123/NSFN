import { clsx } from 'clsx';
import styles from './Text.module.scss';

export enum TextSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'extraLarge',
  EXTRA_EXTRA_LARGE = 'extraExtraLarge',
}

export enum TextWeight {
  THIN = 'thin',
  REGULAR = 'regular',
  MEDIUM = 'medium',
  SEMI_BOLD = 'semiBold',
  BOLD = 'bold',
  EXTRA_BOLD = 'extraBold',
  BLACK = 'black',
}

export enum TextAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

type TextProps = {
  text: string;
  className?: string;
  size?: TextSize;
  weight?: TextWeight;
  align?: TextAlign;
};

export const Text = ({
  text,
  className,
  size = TextSize.MEDIUM,
  weight = TextWeight.REGULAR,
  align = TextAlign.LEFT,
}: TextProps) => {
  return (
    <div className={clsx(styles.text, className, styles[size], styles[weight], styles[align])}>
      {text}
    </div>
  );
};

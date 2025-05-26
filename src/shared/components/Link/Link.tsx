import { clsx } from 'clsx';
import styles from './Link.module.scss';

type LinkProps = {
  text: string;
  className?: string;
  icon?: React.ReactNode;
  hoverExpand?: boolean;
  isParentHovered?: boolean;
};

export const Link = ({ text, className, icon, hoverExpand, isParentHovered }: LinkProps) => {
  return (
    <div
      className={clsx(styles.link, className, {
        [styles.hoverExpand]: hoverExpand,
      })}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      {text && (
        <div className={clsx(styles.text, { [styles.parentHoveredText]: isParentHovered })}>
          {text}
        </div>
      )}
    </div>
  );
};

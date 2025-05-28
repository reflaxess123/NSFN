import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import styles from './Link.module.scss';

type LinkProps = {
  text: string;
  className?: string;
  icon?: React.ReactNode;
  hoverExpand?: boolean;
  isParentHovered?: boolean;
  to?: string;
  onClick?: () => void;
};

export const Link = ({
  text,
  className,
  icon,
  hoverExpand,
  isParentHovered,
  to,
  onClick,
}: LinkProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={clsx(styles.link, className, {
        [styles.hoverExpand]: hoverExpand,
      })}
      onClick={() => {
        if (onClick) {
          onClick();
        } else {
          navigate(to ?? '');
        }
      }}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      {text && (
        <div
          className={clsx(styles.text, {
            [styles.parentHoveredText]: isParentHovered,
          })}
        >
          {text}
        </div>
      )}
    </div>
  );
};

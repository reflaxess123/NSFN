import type { RootState } from '@/app/redux/store';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import styles from './PageWrapper.module.scss';

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  return (
    <>
      <div
        className={clsx(styles.sidebarOverlay, {
          [styles.visible]: isOpen,
        })}
      />
      <div className={styles.pageWrapper}>{children}</div>
    </>
  );
};

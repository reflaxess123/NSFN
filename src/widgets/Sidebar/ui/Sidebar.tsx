import type { RootState } from '@/app/redux/store';
import { Link } from '@/shared/components/Link';
import { AppRoutes } from '@/shared/config/routeConfig';
import { Bird, Brain, Home, LogOut, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../model/slice/sidebarSlice';
import styles from './Sidebar.module.scss';

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const dispatch = useDispatch();
  return (
    <div className={styles.sidebarWrapper}>
      <div
        className={styles.sidebar}
        onMouseEnter={() => dispatch(toggleSidebar())}
        onMouseLeave={() => dispatch(toggleSidebar())}
      >
        <div className={styles.linksTop}>
          <Link
            text="Главная"
            className={styles.link}
            icon={<Home size={16} />}
            isParentHovered={isOpen}
            to="/"
          />
          <Link
            text="Теория"
            className={styles.link}
            icon={<Brain size={16} />}
            isParentHovered={isOpen}
            to={AppRoutes.THEORY}
          />
          <Link
            text="Нарешка"
            className={styles.link}
            icon={<Bird size={16} />}
            isParentHovered={isOpen}
            to={AppRoutes.TASKS}
          />
        </div>
        <div className={styles.linksBottom}>
          <Link
            text="Профиль"
            className={styles.link}
            icon={<User size={16} />}
            isParentHovered={isOpen}
            to={AppRoutes.PROFILE}
          />
          <Link
            text="Выйти"
            className={styles.link}
            icon={<LogOut size={16} />}
            isParentHovered={isOpen}
          />
        </div>
      </div>
      <div className={styles.pageWrapper}>{children}</div>
    </div>
  );
};

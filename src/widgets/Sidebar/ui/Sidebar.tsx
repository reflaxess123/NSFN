import type { RootState } from '@/app/providers/redux/model/store';
import { AppRoutes } from '@/app/providers/router';
import { logoutUser } from '@/entities/User';
import { LoginForm } from '@/features/LoginForm';
import { Link } from '@/shared/components/Link';
import { useTheme } from '@/shared/context/ThemeContext';
import { useAppDispatch, useAuth, useModal } from '@/shared/hooks';
import {
  Bird,
  Brain,
  Home,
  LogIn,
  LogOut,
  Moon,
  Sun,
  User,
} from 'lucide-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toggleSidebar } from '../model/slice/sidebarSlice';
import styles from './Sidebar.module.scss';

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const { isAuthenticated, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const loginModal = useModal('login-modal');

  const handleOpenLogin = () => {
    loginModal.open(<LoginForm />);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(toggleSidebar());
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getThemeIcon = () => {
    return theme === 'light' ? <Sun size={24} /> : <Moon size={24} />;
  };

  const getThemeText = () => {
    return theme === 'light' ? 'Светлая' : 'Темная';
  };

  useEffect(() => {
    if (isAuthenticated) {
      loginModal.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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
            icon={<Home size={24} />}
            isParentHovered={isOpen}
            to="/"
            variant="sidebar"
          />
          {isAuthenticated && (
            <Link
              text="Теория"
              className={styles.link}
              icon={<Brain size={24} />}
              isParentHovered={isOpen}
              to={AppRoutes.THEORY}
              variant="sidebar"
            />
          )}
          {isAuthenticated && (
            <Link
              text="Нарешка"
              className={styles.link}
              icon={<Bird size={24} />}
              isParentHovered={isOpen}
              to={AppRoutes.TASKS}
              variant="sidebar"
            />
          )}
        </div>

        <div className={styles.linksBottom}>
          <Link
            text={getThemeText()}
            className={styles.link}
            icon={getThemeIcon()}
            isParentHovered={isOpen}
            onClick={handleThemeToggle}
            variant="sidebar"
          />

          {isAuthenticated ? (
            <Link
              text={user?.email || ''}
              className={styles.link}
              icon={<User size={24} />}
              isParentHovered={isOpen}
              to={AppRoutes.PROFILE}
              variant="sidebar"
            />
          ) : (
            <Link
              text="Войти"
              className={styles.link}
              icon={<LogIn size={24} />}
              isParentHovered={isOpen}
              onClick={handleOpenLogin}
              variant="sidebar"
            />
          )}
          {isAuthenticated && (
            <Link
              text="Выйти"
              className={styles.link}
              icon={<LogOut size={24} />}
              isParentHovered={isOpen}
              onClick={handleLogout}
              variant="sidebar"
            />
          )}
        </div>
      </div>
      <div className={styles.pageWrapper}>{children}</div>
    </div>
  );
};

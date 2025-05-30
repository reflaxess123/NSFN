import { AppRoutes } from '@/app/providers/router';
import { logoutUser } from '@/entities/User';
import { Link } from '@/shared/components/Link';
import { useAppDispatch, useAuth } from '@/shared/hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { Bird, Brain, Home, LogIn, LogOut, User } from 'lucide-react';
import styles from './MobileMenu.module.scss';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  onOpenLogin,
}: MobileMenuProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();

  const handleOpenLogin = () => {
    if (onOpenLogin) {
      onOpenLogin();
    }
    onClose();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay для закрытия меню */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Само меню */}
          <motion.div
            className={styles.mobileMenu}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className={styles.menuContent}>
              <div className={styles.linksTop}>
                <Link
                  text="Главная"
                  className={styles.link}
                  icon={<Home size={64} />}
                  to="/"
                  onClick={handleLinkClick}
                  isParentHovered={true}
                  size="large"
                />
                {isAuthenticated && (
                  <Link
                    text="Теория"
                    className={styles.link}
                    icon={<Brain size={64} />}
                    to={AppRoutes.THEORY}
                    onClick={handleLinkClick}
                    isParentHovered={true}
                    size="large"
                  />
                )}
                {isAuthenticated && (
                  <Link
                    text="Нарешка"
                    className={styles.link}
                    icon={<Bird size={64} />}
                    to={AppRoutes.TASKS}
                    onClick={handleLinkClick}
                    isParentHovered={true}
                    size="large"
                  />
                )}
              </div>

              <div className={styles.linksBottom}>
                {isAuthenticated ? (
                  <Link
                    text={user?.email || ''}
                    className={styles.link}
                    icon={<User size={64} />}
                    to={AppRoutes.PROFILE}
                    onClick={handleLinkClick}
                    isParentHovered={true}
                    size="large"
                  />
                ) : (
                  <Link
                    text="Войти"
                    className={styles.link}
                    icon={<LogIn size={64} />}
                    onClick={handleOpenLogin}
                    isParentHovered={true}
                    size="large"
                  />
                )}
                {isAuthenticated && (
                  <Link
                    text="Выйти"
                    className={styles.link}
                    icon={<LogOut size={64} />}
                    onClick={handleLogout}
                    isParentHovered={true}
                    size="large"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

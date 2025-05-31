import { isAdmin } from '@/entities/User/model/types';
import { Loading } from '@/shared/components/Loading';
import { PageWrapper } from '@/shared/components/PageWrapper';
import { RoleGuard } from '@/shared/components/RoleGuard';
import { Text, TextSize } from '@/shared/components/Text';
import { TextAlign, TextWeight } from '@/shared/components/Text/ui/Text';
import { useTheme } from '@/shared/context';
import { useAuth } from '@/shared/hooks';
import { AdminDashboard } from '@/widgets/AdminDashboard';
import { useEffect } from 'react';
import styles from './Adminka.module.scss';

const Adminka = () => {
  const { user, isAuthenticated, isInitialized, isLoading, error } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {}, [user, isAuthenticated, isInitialized]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageWrapper>
      <div className={styles.home}>
        {/* Заголовок страницы */}
        <Text
          text="Панель администратора"
          size={TextSize.EXTRA_EXTRA_LARGE}
          weight={TextWeight.MEDIUM}
          align={TextAlign.CENTER}
        />

        {/* Проверка роли пользователя */}
        <RoleGuard
          requiredRole="ADMIN"
          fallback={
            <div className={styles.accessDenied}>
              <Text
                text="🚫 Доступ запрещен"
                size={TextSize.EXTRA_LARGE}
                weight={TextWeight.MEDIUM}
                align={TextAlign.CENTER}
              />
              <Text
                text="У вас нет прав для доступа к панели администратора"
                size={TextSize.MEDIUM}
                align={TextAlign.CENTER}
              />
              {user && (
                <Text
                  text={`Ваша роль: ${user.role}`}
                  size={TextSize.SMALL}
                  align={TextAlign.CENTER}
                />
              )}
            </div>
          }
        >
          {/* Админ панель */}
          <AdminDashboard />
        </RoleGuard>

        {/* Отладочная информация */}
        <div className={styles.debugInfo}>
          <details>
            <summary>Отладочная информация</summary>
            <div className={styles.userInfo}>
              {user && (
                <>
                  <Text
                    text={`Email: ${user.email}`}
                    size={TextSize.SMALL}
                    align={TextAlign.CENTER}
                  />
                  <Text
                    text={`Role: ${user.role}`}
                    size={TextSize.SMALL}
                    align={TextAlign.CENTER}
                  />
                  <Text
                    text={`Is Admin: ${isAdmin(user.role) ? 'Yes' : 'No'}`}
                    size={TextSize.SMALL}
                    align={TextAlign.CENTER}
                  />
                </>
              )}
              <Text
                text={`Authenticated: ${isAuthenticated ? 'Yes' : 'No'}`}
                size={TextSize.SMALL}
                align={TextAlign.CENTER}
              />
              <Text
                text={`Initialized: ${isInitialized ? 'Yes' : 'No'}`}
                size={TextSize.SMALL}
                align={TextAlign.CENTER}
              />
              <Text
                text={`Theme: ${theme}`}
                size={TextSize.SMALL}
                align={TextAlign.CENTER}
              />
              {error && <p className={styles.userInfoItem}>Error: {error}</p>}
            </div>
          </details>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Adminka;

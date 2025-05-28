import { LoginForm } from '@/features/LoginForm';
import { Loading } from '@/shared/components/Loading';
import { PageWrapper } from '@/shared/components/PageWrapper';
import { Text, TextSize } from '@/shared/components/Text';
import { TextAlign, TextWeight } from '@/shared/components/Text/Text';
import { useAuth } from '@/shared/hooks';
import { useEffect } from 'react';
import styles from './Home.module.scss';

const Home = () => {
  const { user, isAuthenticated, isInitialized, isLoading, error } = useAuth();

  useEffect(() => {
    console.log('User changed:', user);
    console.log('Is authenticated changed:', isAuthenticated);
  }, [user, isAuthenticated, isInitialized]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageWrapper>
      <div className={styles.home}>
        <Text
          text="Добро пожаловать в наш мир, пидр ибаный!"
          size={TextSize.EXTRA_EXTRA_LARGE}
          weight={TextWeight.MEDIUM}
          align={TextAlign.CENTER}
        />
        <LoginForm />
        <div className={styles.userInfo}>
          <p className={styles.userInfoItem}>User: {user?.email}</p>
          <p className={styles.userInfoItem}>
            Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}
          </p>
          <p className={styles.userInfoItem}>
            Is Initialized: {isInitialized ? 'Yes' : 'No'}
          </p>
          <p className={styles.userInfoItem}>Error: {error}</p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Home;

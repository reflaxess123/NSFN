import { loginUser, logoutUser } from '@/entities/User';
import { Loading } from '@/shared/components/Loading';
import { PageWrapper } from '@/shared/components/PageWrapper';
import { Text, TextSize } from '@/shared/components/Text';
import { TextAlign, TextWeight } from '@/shared/components/Text/Text';
import { useAppDispatch, useAuth } from '@/shared/hooks';
import { useEffect } from 'react';
import styles from './Home.module.scss';

const Home = () => {
  const { user, isAuthenticated, isInitialized, isLoading, error } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('User changed:', user);
    console.log('Is authenticated changed:', isAuthenticated);
  }, [user, isAuthenticated, isInitialized]);

  const handleLogin = () => {
    dispatch(
      loginUser({
        email: 'reflaxess@gmail.com',
        password: '123123123',
      })
    );
  };
  const handleLogout = () => {
    dispatch(logoutUser());
  };

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
        <div className={styles.userInfo}>
          <p className={styles.userInfoItem}>User: {user?.email}</p>
          <p className={styles.userInfoItem}>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p className={styles.userInfoItem}>Is Initialized: {isInitialized ? 'Yes' : 'No'}</p>
          <p className={styles.userInfoItem}>Error: {error}</p>
        </div>
        <button className={styles.button} onClick={handleLogin}>
          Login
        </button>
        <button className={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </PageWrapper>
  );
};

export default Home;

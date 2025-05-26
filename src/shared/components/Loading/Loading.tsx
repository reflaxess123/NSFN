import { PageWrapper } from '../PageWrapper';
import styles from './Loading.module.scss';

export const Loading = () => {
  return (
    <PageWrapper>
      <div className={styles.center}>
        <div className={styles.loader}></div>
      </div>
    </PageWrapper>
  );
};

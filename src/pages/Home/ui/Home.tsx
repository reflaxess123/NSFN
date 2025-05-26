import { PageWrapper } from '@/shared/components/PageWrapper';
import { Text, TextSize } from '@/shared/components/Text';
import { TextAlign, TextWeight } from '@/shared/components/Text/Text';
import styles from './Home.module.scss';

const Home = () => {
  return (
    <PageWrapper>
      <div className={styles.home}>
        <Text
          text="Добро пожаловать в наш мир, пидр ибаный!"
          size={TextSize.EXTRA_EXTRA_LARGE}
          weight={TextWeight.MEDIUM}
          align={TextAlign.CENTER}
        />
      </div>
    </PageWrapper>
  );
};

export default Home;

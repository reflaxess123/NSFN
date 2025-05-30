import { TheoryCard, useTheoryCards } from '@/entities/TheoryCard';
import styles from './Theory.module.scss';

const Theory = () => {
  const { data, isLoading, error } = useTheoryCards({
    page: 1,
    limit: 10,
  });

  if (isLoading) {
    return (
      <div className={styles.theory}>
        <div className={styles.container}>
          <div className={styles.loadingState}>Загружаем теорию...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.theory}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            Ошибка загрузки: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.theory}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Теория</h1>
          <p>Изучайте материалы в удобном формате</p>
        </div>
        <div className={styles.cardsGrid}>
          {data?.data.map((card) => <TheoryCard key={card.id} card={card} />)}
        </div>
      </div>
    </div>
  );
};

export default Theory;

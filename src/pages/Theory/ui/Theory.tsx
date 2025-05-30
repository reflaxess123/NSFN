import { TheoryCard, useTheoryCards } from '@/entities/TheoryCard';
import { PageWrapper } from '@/shared/components/PageWrapper';
import { Text, TextSize } from '@/shared/components/Text';
import { TextAlign, TextWeight } from '@/shared/components/Text/ui/Text';
import styles from './Theory.module.scss';

const Theory = () => {
  const { data, isLoading, error } = useTheoryCards({
    page: 1,
    limit: 10,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <PageWrapper>
      <div className={styles.theory}>
        <Text
          text="Теория"
          size={TextSize.EXTRA_EXTRA_LARGE}
          weight={TextWeight.MEDIUM}
          align={TextAlign.CENTER}
        />
        {data?.data.map((card) => <TheoryCard key={card.id} card={card} />)}
      </div>
    </PageWrapper>
  );
};

export default Theory;

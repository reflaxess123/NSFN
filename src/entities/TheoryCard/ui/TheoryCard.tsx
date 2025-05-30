import type { TheoryCard as TheoryCardType } from '../model/types';
import styles from './TheoryCard.module.scss';

interface TheoryCardProps {
  card: TheoryCardType;
}

export const TheoryCard = ({ card }: TheoryCardProps) => {
  return (
    <div className={styles.theoryCard}>
      <div className={styles.question}>
        <div dangerouslySetInnerHTML={{ __html: card.questionBlock }} />
      </div>
    </div>
  );
};

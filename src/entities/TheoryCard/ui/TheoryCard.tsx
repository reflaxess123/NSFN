import { useState } from 'react';
import type { TheoryCard as TheoryCardType } from '../model/types';
import styles from './TheoryCard.module.scss';

interface TheoryCardProps {
  card: TheoryCardType;
}

export const TheoryCard = ({ card }: TheoryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${styles.theoryCard} ${isExpanded ? styles.expanded : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>📚</div>
        <div className={styles.expandIcon}>{isExpanded ? '−' : '+'}</div>
      </div>
      <div className={styles.question}>
        <div dangerouslySetInnerHTML={{ __html: card.questionBlock }} />
      </div>
      {isExpanded && (
        <div className={styles.additionalInfo}>
          <div className={styles.answerSection}>
            <h4 className={styles.answerTitle}>💡 Ответ:</h4>
            <div
              className={styles.answerContent}
              dangerouslySetInnerHTML={{ __html: card.answerBlock }}
            />
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.difficulty}>⭐ Базовый уровень</span>
          </div>
        </div>
      )}
    </div>
  );
};

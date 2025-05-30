import { useState } from 'react';
import { useUpdateProgress } from '../model/queries';
import type { TheoryCard as TheoryCardType } from '../model/types';
import { CATEGORY_ICONS } from '../model/types';
import styles from './TheoryCard.module.scss';

interface TheoryCardProps {
  card: TheoryCardType;
}

export const TheoryCard = ({ card }: TheoryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const updateProgressMutation = useUpdateProgress();

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleProgressUpdate = (action: 'increment' | 'decrement') => {
    updateProgressMutation.mutate({
      cardId: card.id,
      data: { action },
    });
  };

  // Получаем иконку для категории
  const categoryIcon = CATEGORY_ICONS[card.category] || CATEGORY_ICONS.DEFAULT;

  // Определяем уровень прогресса
  const getProgressLevel = (count: number) => {
    if (count === 0)
      return { level: 'Не изучено', color: '#ef4444', emoji: '🔴' };
    if (count <= 2)
      return { level: 'Начальный', color: '#f59e0b', emoji: '🟡' };
    if (count <= 5) return { level: 'Средний', color: '#3b82f6', emoji: '🔵' };
    return { level: 'Изучено', color: '#10b981', emoji: '🟢' };
  };

  const progressInfo = getProgressLevel(card.currentUserSolvedCount);

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
        <div className={styles.categoryInfo}>
          <div
            className={styles.categoryIcon}
            style={{ color: categoryIcon.color }}
          >
            {categoryIcon.icon}
          </div>
          <div className={styles.categoryText}>
            <span className={styles.category}>{card.category}</span>
            {card.subCategory && (
              <span className={styles.subCategory}>{card.subCategory}</span>
            )}
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.progressInfo}>
            <span className={styles.progressEmoji}>{progressInfo.emoji}</span>
            <span className={styles.progressCount}>
              {card.currentUserSolvedCount}
            </span>
            <span
              className={styles.progressLevel}
              style={{ color: progressInfo.color }}
            >
              {progressInfo.level}
            </span>
          </div>
          <div className={styles.expandIcon}>{isExpanded ? '−' : '+'}</div>
        </div>
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
            <div className={styles.progressActions}>
              <button
                className={styles.progressButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProgressUpdate('increment');
                }}
                disabled={updateProgressMutation.isPending}
              >
                ✅ Изучил
              </button>
              {card.currentUserSolvedCount > 0 && (
                <button
                  className={`${styles.progressButton} ${styles.decrementButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProgressUpdate('decrement');
                  }}
                  disabled={updateProgressMutation.isPending}
                >
                  ↩️ Отменить
                </button>
              )}
            </div>

            {card.tags.length > 0 && (
              <div className={styles.tags}>
                {card.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

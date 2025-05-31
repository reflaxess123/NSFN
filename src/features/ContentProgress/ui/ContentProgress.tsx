import {
  ButtonSize,
  ButtonVariant,
} from '@/shared/components/Button/model/types';
import { Button } from '@/shared/components/Button/ui/Button';
import { useUpdateProgress } from '@/shared/hooks/useContentBlocks';
import { Check, Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';
import styles from './ContentProgress.module.scss';

interface ContentProgressProps {
  blockId: string;
  currentCount: number;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export const ContentProgress = ({
  blockId,
  currentCount,
  className,
  variant = 'default',
}: ContentProgressProps) => {
  const updateProgressMutation = useUpdateProgress();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleIncrement = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await updateProgressMutation.mutateAsync({
        blockId,
        action: 'increment',
      });
    } catch (error) {
      console.error('Ошибка увеличения прогресса:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrement = async () => {
    if (isUpdating || currentCount <= 0) return;

    setIsUpdating(true);
    try {
      await updateProgressMutation.mutateAsync({
        blockId,
        action: 'decrement',
      });
    } catch (error) {
      console.error('Ошибка уменьшения прогресса:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div
        className={`${styles.contentProgress} ${styles.compact} ${className || ''}`}
      >
        <button
          onClick={handleIncrement}
          disabled={isUpdating}
          className={`${styles.compactButton} ${styles.increment}`}
          aria-label="Отметить как решено"
        >
          <Plus size={16} />
        </button>

        {currentCount > 0 && (
          <>
            <span className={styles.count}>{currentCount}</span>
            <button
              onClick={handleDecrement}
              disabled={isUpdating}
              className={`${styles.compactButton} ${styles.decrement}`}
              aria-label="Убрать отметку"
            >
              <Minus size={16} />
            </button>
          </>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div
        className={`${styles.contentProgress} ${styles.detailed} ${className || ''}`}
      >
        <div className={styles.progressInfo}>
          <span className={styles.label}>Решений:</span>
          <span className={styles.count}>{currentCount}</span>
        </div>

        <div className={styles.actions}>
          <Button
            onClick={handleIncrement}
            disabled={isUpdating}
            size={ButtonSize.SM}
            variant={ButtonVariant.PRIMARY}
            leftIcon={<Check size={16} />}
          >
            Решено
          </Button>

          {currentCount > 0 && (
            <Button
              onClick={handleDecrement}
              disabled={isUpdating}
              size={ButtonSize.SM}
              variant={ButtonVariant.GHOST}
              leftIcon={<X size={16} />}
            >
              Отменить
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={`${styles.contentProgress} ${styles.default} ${className || ''}`}
    >
      <Button
        onClick={handleIncrement}
        disabled={isUpdating}
        size={ButtonSize.SM}
        variant={
          currentCount > 0 ? ButtonVariant.SECONDARY : ButtonVariant.PRIMARY
        }
        leftIcon={<Check size={16} />}
      >
        {currentCount > 0 ? `Решено (${currentCount})` : 'Решено'}
      </Button>

      {currentCount > 0 && (
        <Button
          onClick={handleDecrement}
          disabled={isUpdating}
          size={ButtonSize.SM}
          variant={ButtonVariant.GHOST}
          leftIcon={<X size={16} />}
        >
          Отменить
        </Button>
      )}
    </div>
  );
};

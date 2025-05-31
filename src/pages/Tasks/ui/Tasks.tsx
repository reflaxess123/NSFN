import { selectUser } from '@/entities/User';
import { ContentFilters } from '@/features/ContentFilters';
import { PageWrapper } from '@/shared/components/PageWrapper';
import { TextSize } from '@/shared/components/Text';
import { Text, TextAlign, TextWeight } from '@/shared/components/Text/ui/Text';
import { useRole } from '@/shared/hooks';
import { useAppSelector } from '@/shared/hooks/redux';
import { useContentCategories } from '@/shared/hooks/useContentBlocks';
import { ContentBlocksList } from '@/widgets/ContentBlocksList';
import { LogIn } from 'lucide-react';
import { useEffect } from 'react';
import styles from './Tasks.module.scss';

const Tasks = () => {
  const user = useAppSelector(selectUser);
  const { isGuest } = useRole();

  // Загружаем категории при монтировании
  useContentCategories();

  useEffect(() => {
    // Проверяем авторизацию пользователя
    if (!user) {
      console.warn('Пользователь не авторизован');
    }
  }, [user]);

  return (
    <PageWrapper>
      <div className={styles.tasks}>
        <header className={styles.header}>
          <Text
            text="Задачи и упражнения"
            size={TextSize.EXTRA_EXTRA_LARGE}
            weight={TextWeight.MEDIUM}
            align={TextAlign.CENTER}
          />

          {/* Уведомление для гостей */}
          {isGuest && (
            <div className={styles.guestNotice}>
              <LogIn size={20} />
              <Text
                text="Авторизуйтесь, чтобы отслеживать прогресс решения задач"
                size={TextSize.MEDIUM}
                align={TextAlign.CENTER}
              />
            </div>
          )}
        </header>

        <div className={styles.content}>
          {/* Фильтры */}
          <div className={styles.filtersSection}>
            <ContentFilters className={styles.filters} />
          </div>

          {/* Список контент-блоков */}
          <div className={styles.blocksSection}>
            <ContentBlocksList
              variant="default"
              className={styles.blocksList}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Tasks;

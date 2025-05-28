import { PageWrapper } from '@/shared/components/PageWrapper';
import { TextSize } from '@/shared/components/Text';
import { Text, TextAlign, TextWeight } from '@/shared/components/Text/ui/Text';
import styles from './Tasks.module.scss';

const Tasks = () => {
  return (
    <PageWrapper>
      <div className={styles.tasks}>
        <Text
          text="Задачи"
          size={TextSize.EXTRA_EXTRA_LARGE}
          weight={TextWeight.MEDIUM}
          align={TextAlign.CENTER}
        />
      </div>
    </PageWrapper>
  );
};

export default Tasks;

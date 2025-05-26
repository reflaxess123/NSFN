import { PageWrapper } from '@/shared/components/PageWrapper';
import { Text, TextSize } from '@/shared/components/Text';
import { TextAlign, TextWeight } from '@/shared/components/Text/Text';
import styles from './Theory.module.scss';

const Theory = () => {
  return (
    <PageWrapper>
      <div className={styles.theory}>
        <Text
          text="Теория"
          size={TextSize.EXTRA_EXTRA_LARGE}
          weight={TextWeight.MEDIUM}
          align={TextAlign.CENTER}
        />
      </div>
    </PageWrapper>
  );
};

export default Theory;

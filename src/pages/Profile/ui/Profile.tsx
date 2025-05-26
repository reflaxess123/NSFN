import { PageWrapper } from '@/shared/components/PageWrapper';
import { Text, TextSize } from '@/shared/components/Text';
import { TextAlign, TextWeight } from '@/shared/components/Text/Text';
import styles from './Profile.module.scss';

const Profile = () => {
  return (
    <PageWrapper>
      <div className={styles.profile}>
        <Text
          text="Профиль"
          size={TextSize.EXTRA_EXTRA_LARGE}
          weight={TextWeight.MEDIUM}
          align={TextAlign.CENTER}
        />
      </div>
    </PageWrapper>
  );
};

export default Profile;

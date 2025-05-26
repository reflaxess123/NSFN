import { Link } from '@/shared/components/Link';
import { Bird, Brain, Home, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import styles from './Sidebar.module.scss';

export const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.sidebar}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.linksTop}>
        <Link
          text="Главная"
          className={styles.link}
          icon={<Home size={16} />}
          isParentHovered={isHovered}
        />
        <Link
          text="Теория"
          className={styles.link}
          icon={<Brain size={16} />}
          isParentHovered={isHovered}
        />
        <Link
          text="Нарешка"
          className={styles.link}
          icon={<Bird size={16} />}
          isParentHovered={isHovered}
        />
      </div>
      <div className={styles.linksBottom}>
        <Link
          text="Профиль"
          className={styles.link}
          icon={<User size={16} />}
          isParentHovered={isHovered}
        />
        <Link
          text="Выйти"
          className={styles.link}
          icon={<LogOut size={16} />}
          isParentHovered={isHovered}
        />
      </div>
    </div>
  );
};

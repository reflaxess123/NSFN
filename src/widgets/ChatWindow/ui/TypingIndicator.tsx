import type { ChatParticipant } from '@/entities/Chat';
import styles from './TypingIndicator.module.scss';

interface TypingIndicatorProps {
  typingUsers: number[];
  roomParticipants: ChatParticipant[];
}

export const TypingIndicator = ({
  typingUsers,
  roomParticipants,
}: TypingIndicatorProps) => {
  const getTypingUserNames = () => {
    return typingUsers
      .map((userId) => {
        const participant = roomParticipants.find((p) => p.user.id === userId);
        return participant?.user.email.split('@')[0] || 'Пользователь';
      })
      .slice(0, 3); // Показываем максимум 3 имени
  };

  const typingUserNames = getTypingUserNames();

  if (typingUserNames.length === 0) return null;

  const getTypingText = () => {
    if (typingUserNames.length === 1) {
      return `${typingUserNames[0]} печатает...`;
    } else if (typingUserNames.length === 2) {
      return `${typingUserNames[0]} и ${typingUserNames[1]} печатают...`;
    } else if (typingUserNames.length === 3) {
      return `${typingUserNames[0]}, ${typingUserNames[1]} и ${typingUserNames[2]} печатают...`;
    } else {
      return `${typingUserNames[0]} и еще ${typingUserNames.length - 1} печатают...`;
    }
  };

  return (
    <div className={styles.typingIndicator}>
      <div className={styles.typingDots}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className={styles.typingText}>{getTypingText()}</span>
    </div>
  );
};

import type { ChatRoom } from '@/entities/Chat';
import { MoreVertical, User, Users } from 'lucide-react';
import styles from './ChatHeader.module.scss';

interface ChatHeaderProps {
  room: ChatRoom;
}

export const ChatHeader = ({ room }: ChatHeaderProps) => {
  const getRoomDisplayName = () => {
    if (room.type === 'GROUP') {
      return room.name || 'Группа';
    }

    // Для приватного чата показываем email собеседника
    const otherParticipant = room.participants.find(
      (p) => p.user.id !== room.createdBy
    );
    return otherParticipant?.user.email || 'Приватный чат';
  };

  const getOnlineCount = () => {
    return room.participants.filter((p) => p.user.isOnline).length;
  };

  return (
    <div className={styles.chatHeader}>
      <div className={styles.roomInfo}>
        <div className={styles.roomIcon}>
          {room.type === 'GROUP' ? <Users size={20} /> : <User size={20} />}
        </div>

        <div className={styles.roomDetails}>
          <h3 className={styles.roomName}>{getRoomDisplayName()}</h3>
          <p className={styles.roomStatus}>
            {room.type === 'GROUP'
              ? `${room.participants.length} участников, ${getOnlineCount()} онлайн`
              : room.participants.find((p) => p.user.id !== room.createdBy)
                    ?.user.isOnline
                ? 'онлайн'
                : 'не в сети'}
          </p>
        </div>
      </div>

      <button className={styles.menuButton} aria-label="Меню чата">
        <MoreVertical size={20} />
      </button>
    </div>
  );
};

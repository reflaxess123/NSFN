import type { ChatRoom } from '@/entities/Chat';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { User, Users } from 'lucide-react';
import styles from './RoomItem.module.scss';

interface RoomItemProps {
  room: ChatRoom;
  isActive: boolean;
  currentUserId?: number;
  onClick: () => void;
}

export const RoomItem = ({
  room,
  isActive,
  currentUserId,
  onClick,
}: RoomItemProps) => {
  const getRoomDisplayName = () => {
    if (room.type === 'GROUP') {
      return room.name || 'Группа';
    }

    // Для приватного чата показываем email собеседника
    const otherParticipant = room.participants.find(
      (p) => p.user.id !== currentUserId
    );
    return otherParticipant?.user.email || 'Приватный чат';
  };

  const getLastMessagePreview = () => {
    if (!room.lastMessage) {
      return 'Нет сообщений';
    }

    if (room.lastMessage.isDeleted) {
      return 'Сообщение удалено';
    }

    return room.lastMessage.content;
  };

  const getLastMessageTime = () => {
    if (!room.lastMessage) return '';

    try {
      return formatDistanceToNow(new Date(room.lastMessage.createdAt), {
        addSuffix: false,
        locale: ru,
      });
    } catch {
      return '';
    }
  };

  const getOnlineStatus = () => {
    if (room.type === 'GROUP') {
      const onlineCount = room.participants.filter(
        (p) => p.user.isOnline
      ).length;
      return onlineCount > 0;
    } else {
      const otherParticipant = room.participants.find(
        (p) => p.user.id !== currentUserId
      );
      return otherParticipant?.user.isOnline || false;
    }
  };

  const unreadCount = room.unreadCount || 0;

  return (
    <div
      className={`${styles.roomItem} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <div className={styles.roomIcon}>
        {room.type === 'GROUP' ? <Users size={20} /> : <User size={20} />}
        {getOnlineStatus() && <div className={styles.onlineIndicator} />}
      </div>

      <div className={styles.roomContent}>
        <div className={styles.roomHeader}>
          <h4 className={styles.roomName}>{getRoomDisplayName()}</h4>
          {room.lastMessage && (
            <span className={styles.lastMessageTime}>
              {getLastMessageTime()}
            </span>
          )}
        </div>

        <div className={styles.roomFooter}>
          <p className={styles.lastMessage}>{getLastMessagePreview()}</p>
          {unreadCount > 0 && (
            <div className={styles.unreadBadge}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

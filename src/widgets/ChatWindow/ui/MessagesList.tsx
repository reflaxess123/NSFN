import type { ChatMessage } from '@/entities/Chat';
import { Loading } from '@/shared/components/Loading';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import styles from './MessagesList.module.scss';

interface MessagesListProps {
  messages: ChatMessage[];
  currentUserId?: number;
  isLoading: boolean;
}

export const MessagesList = ({
  messages,
  currentUserId,
  isLoading,
}: MessagesListProps) => {
  const formatMessageTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ru,
      });
    } catch {
      return 'недавно';
    }
  };

  const isOwnMessage = (message: ChatMessage) => {
    return message.senderId === currentUserId;
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={styles.emptyMessages}>
        <p>Пока нет сообщений</p>
        <span>Начните общение!</span>
      </div>
    );
  }

  return (
    <div className={styles.messagesList}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.messageItem} ${
            isOwnMessage(message) ? styles.ownMessage : styles.otherMessage
          }`}
        >
          {!isOwnMessage(message) && (
            <div className={styles.senderInfo}>
              <span className={styles.senderName}>{message.sender.email}</span>
            </div>
          )}

          <div className={styles.messageContent}>
            <div className={styles.messageText}>
              {message.isDeleted ? (
                <em className={styles.deletedMessage}>Сообщение удалено</em>
              ) : (
                <>
                  {message.content}
                  {message.isEdited && (
                    <span className={styles.editedLabel}> (изменено)</span>
                  )}
                </>
              )}
            </div>

            <div className={styles.messageTime}>
              {formatMessageTime(message.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

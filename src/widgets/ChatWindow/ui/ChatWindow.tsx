import {
  addMessage,
  addTypingUser,
  deleteMessage,
  removeTypingUser,
  selectChatIsLoading,
  selectCurrentRoom,
  selectCurrentRoomMessages,
  selectCurrentRoomTypingUsers,
  setRoomMessages,
  updateMessage,
} from '@/entities/Chat';
import { selectUser } from '@/entities/User';
import { SendMessageForm } from '@/features/SendMessage';
import { chatApi } from '@/shared/api/chat';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { webSocketService } from '@/shared/services/websocket';
import { useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import styles from './ChatWindow.module.scss';
import { MessagesList } from './MessagesList';
import { TypingIndicator } from './TypingIndicator';

export const ChatWindow = () => {
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentRoom = useAppSelector(selectCurrentRoom);
  const messages = useAppSelector(selectCurrentRoomMessages);
  const typingUsers = useAppSelector(selectCurrentRoomTypingUsers);
  const isLoading = useAppSelector(selectChatIsLoading);
  const currentUser = useAppSelector(selectUser);

  // Загружаем сообщения при смене комнаты
  useEffect(() => {
    if (currentRoom?.id) {
      loadMessages(currentRoom.id);

      // Присоединяемся к комнате через WebSocket
      webSocketService.joinRoom(currentRoom.id);

      // Отмечаем сообщения как прочитанные
      chatApi.markAsRead(currentRoom.id);
    }
  }, [currentRoom?.id]);

  // Подписываемся на WebSocket события
  useEffect(() => {
    // Новое сообщение
    webSocketService.onMessageReceived((message) => {
      dispatch(addMessage(message));
      scrollToBottom();
    });

    // Обновление сообщения
    webSocketService.onMessageUpdated((message) => {
      dispatch(updateMessage(message));
    });

    // Удаление сообщения
    webSocketService.onMessageDeleted((messageId, roomId) => {
      dispatch(deleteMessage({ messageId, roomId }));
    });

    // Индикатор печати
    webSocketService.onUserTyping((userId, roomId) => {
      if (currentRoom?.id === roomId && userId !== currentUser?.id) {
        dispatch(addTypingUser({ roomId, userId }));
      }
    });

    webSocketService.onUserStoppedTyping((userId, roomId) => {
      if (currentRoom?.id === roomId) {
        dispatch(removeTypingUser({ roomId, userId }));
      }
    });

    // Очистка подписок при размонтировании
    return () => {
      webSocketService.off('message_received');
      webSocketService.off('message_updated');
      webSocketService.off('message_deleted');
      webSocketService.off('user_typing');
      webSocketService.off('user_stopped_typing');
    };
  }, [currentRoom?.id, currentUser?.id, dispatch]);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (roomId: string) => {
    try {
      const roomMessages = await chatApi.getRoomMessages(roomId);
      dispatch(setRoomMessages({ roomId, messages: roomMessages }));
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    // Сообщение отправляется через WebSocket в SendMessageForm
    // Здесь можно добавить дополнительную логику если нужно
    scrollToBottom();
  };

  if (!currentRoom) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyContent}>
          <h3>Выберите чат</h3>
          <p>Выберите существующий чат или создайте новый</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatWindow}>
      <ChatHeader room={currentRoom} />

      <div className={styles.messagesContainer}>
        <MessagesList
          messages={messages}
          currentUserId={currentUser?.id}
          isLoading={isLoading}
        />

        {typingUsers.length > 0 && (
          <TypingIndicator
            typingUsers={typingUsers}
            roomParticipants={currentRoom.participants}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      <SendMessageForm onSend={handleSendMessage} disabled={!currentRoom} />
    </div>
  );
};

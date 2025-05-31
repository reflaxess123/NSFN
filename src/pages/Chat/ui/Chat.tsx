import { addOnlineUser, removeOnlineUser, setError } from '@/entities/Chat';
import { selectUser } from '@/entities/User';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { webSocketService } from '@/shared/services/websocket';
import { ChatWindow } from '@/widgets/ChatWindow';
import { RoomsList } from '@/widgets/RoomsList';
import { useEffect } from 'react';
import styles from './Chat.module.scss';

export const Chat = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);

  // Подключаемся к WebSocket при монтировании
  useEffect(() => {
    if (currentUser?.id) {
      connectToWebSocket();
    }

    return () => {
      webSocketService.disconnect();
    };
  }, [currentUser?.id]);

  const connectToWebSocket = async () => {
    try {
      await webSocketService.connect();

      if (currentUser?.id && currentUser?.email) {
        // Аутентифицируемся
        webSocketService.authenticate(currentUser.id, currentUser.email);

        // Подписываемся на события онлайн статуса
        webSocketService.onUserOnline((userId) => {
          dispatch(addOnlineUser(userId));
        });

        webSocketService.onUserOffline((userId) => {
          dispatch(removeOnlineUser(userId));
        });
      }
    } catch (error) {
      console.error('Ошибка подключения к WebSocket:', error);
      dispatch(setError('Не удалось подключиться к чату'));
    }
  };

  if (!currentUser) {
    return (
      <div className={styles.authRequired}>
        <h2>Требуется авторизация</h2>
        <p>Войдите в систему для доступа к чату</p>
      </div>
    );
  }

  return (
    <div className={styles.chat}>
      <RoomsList />
      <ChatWindow />
    </div>
  );
};

import type {
  ChatMessage,
  ChatRoom,
  ChatUser,
  CreateRoomRequest,
} from '@/entities/Chat/model/types';
import type { AxiosResponse } from 'axios';
import { apiInstance } from './base';

export const chatApi = {
  // Получить комнаты пользователя
  getRooms: (): Promise<ChatRoom[]> =>
    apiInstance
      .get('/api/chat/rooms')
      .then((response: AxiosResponse<ChatRoom[]>) => response.data),

  // Создать новую комнату
  createRoom: (data: CreateRoomRequest): Promise<ChatRoom> =>
    apiInstance
      .post('/api/chat/rooms', data)
      .then((response: AxiosResponse<ChatRoom>) => response.data),

  // Получить сообщения комнаты
  getRoomMessages: (
    roomId: string,
    page = 1,
    limit = 50
  ): Promise<ChatMessage[]> =>
    apiInstance
      .get(`/api/chat/rooms/${roomId}/messages`, {
        params: { page, limit },
      })
      .then((response: AxiosResponse<ChatMessage[]>) => response.data),

  // Отметить сообщения как прочитанные
  markAsRead: (roomId: string): Promise<void> =>
    apiInstance
      .post(`/api/chat/rooms/${roomId}/read`)
      .then((response: AxiosResponse<void>) => response.data),

  // Получить список пользователей
  getUsers: (): Promise<ChatUser[]> =>
    apiInstance
      .get('/api/chat/users')
      .then((response: AxiosResponse<ChatUser[]>) => response.data),

  // Удалить сообщение
  deleteMessage: (messageId: string): Promise<void> =>
    apiInstance
      .delete(`/api/chat/messages/${messageId}`)
      .then((response: AxiosResponse<void>) => response.data),

  // Редактировать сообщение
  editMessage: (messageId: string, content: string): Promise<ChatMessage> =>
    apiInstance
      .put(`/api/chat/messages/${messageId}`, { content })
      .then((response: AxiosResponse<ChatMessage>) => response.data),
};

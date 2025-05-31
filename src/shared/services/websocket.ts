import type {
  ChatMessage,
  ChatRoom,
  SendMessageRequest,
} from '@/entities/Chat/model/types';
import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.isConnected) {
        resolve(this.socket);
        return;
      }

      this.socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:4000', {
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        resolve(this.socket!);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error: Error) => {
        reject(error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  emit(event: string, ...args: unknown[]) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, ...args);
    }
  }

  on(event: string, callback: (...args: unknown[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: unknown[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  authenticate(userId: number, userEmail: string) {
    this.emit('authenticate', { userId, userEmail });
  }

  joinRoom(roomId: string) {
    this.emit('join_room', roomId);
  }

  leaveRoom(roomId: string) {
    this.emit('leave_room', roomId);
  }

  sendMessage(data: SendMessageRequest) {
    this.emit('send_message', data);
  }

  markAsRead(roomId: string) {
    this.emit('mark_as_read', roomId);
  }

  startTyping(roomId: string) {
    this.emit('typing_start', roomId);
  }

  stopTyping(roomId: string) {
    this.emit('typing_stop', roomId);
  }

  // Типизированные методы для подписки на события
  onAuthenticated(
    callback: (data: { success: boolean; message?: string }) => void
  ) {
    this.on('authenticated', (...args) =>
      callback(args[0] as { success: boolean; message?: string })
    );
  }

  onMessageReceived(callback: (message: ChatMessage) => void) {
    this.on('message_received', (...args) => callback(args[0] as ChatMessage));
  }

  onMessageUpdated(callback: (message: ChatMessage) => void) {
    this.on('message_updated', (...args) => callback(args[0] as ChatMessage));
  }

  onMessageDeleted(callback: (messageId: string, roomId: string) => void) {
    this.on('message_deleted', (...args) =>
      callback(args[0] as string, args[1] as string)
    );
  }

  onUserTyping(callback: (userId: number, roomId: string) => void) {
    this.on('user_typing', (...args) =>
      callback(args[0] as number, args[1] as string)
    );
  }

  onUserStoppedTyping(callback: (userId: number, roomId: string) => void) {
    this.on('user_stopped_typing', (...args) =>
      callback(args[0] as number, args[1] as string)
    );
  }

  onUserOnline(callback: (userId: number) => void) {
    this.on('user_online', (...args) => callback(args[0] as number));
  }

  onUserOffline(callback: (userId: number) => void) {
    this.on('user_offline', (...args) => callback(args[0] as number));
  }

  onMessagesRead(
    callback: (data: { userId: number; roomId: string; readAt: string }) => void
  ) {
    this.on('messages_read', (...args) =>
      callback(args[0] as { userId: number; roomId: string; readAt: string })
    );
  }

  onRoomCreated(callback: (room: ChatRoom) => void) {
    this.on('room_created', (...args) => callback(args[0] as ChatRoom));
  }

  onRoomUpdated(callback: (room: ChatRoom) => void) {
    this.on('room_updated', (...args) => callback(args[0] as ChatRoom));
  }

  onError(callback: (error: { message: string; code?: string }) => void) {
    this.on('error', (...args) =>
      callback(args[0] as { message: string; code?: string })
    );
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected;
  }
}

export const webSocketService = new WebSocketService();

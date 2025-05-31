import type { RootState } from '@/app/providers/redux/model/store';
import type { ChatRoom } from './types';

export const selectChatState = (state: RootState) => state.chat;

export const selectChatRooms = (state: RootState) => state.chat.rooms;

export const selectCurrentRoomId = (state: RootState) =>
  state.chat.currentRoomId;

export const selectCurrentRoom = (state: RootState) => {
  const { rooms, currentRoomId } = state.chat;
  return currentRoomId
    ? rooms.find((room: ChatRoom) => room.id === currentRoomId)
    : null;
};

export const selectRoomMessages = (roomId: string) => (state: RootState) =>
  state.chat.messages[roomId] || [];

export const selectCurrentRoomMessages = (state: RootState) => {
  const { currentRoomId, messages } = state.chat;
  return currentRoomId ? messages[currentRoomId] || [] : [];
};

export const selectChatIsLoading = (state: RootState) => state.chat.isLoading;

export const selectChatError = (state: RootState) => state.chat.error;

export const selectOnlineUsers = (state: RootState) => state.chat.onlineUsers;

export const selectTypingUsers = (roomId: string) => (state: RootState) =>
  state.chat.typingUsers[roomId] || [];

export const selectCurrentRoomTypingUsers = (state: RootState) => {
  const { currentRoomId, typingUsers } = state.chat;
  return currentRoomId ? typingUsers[currentRoomId] || [] : [];
};

export const selectUnreadRoomsCount = (state: RootState) =>
  state.chat.rooms.filter((room: ChatRoom) => (room.unreadCount || 0) > 0)
    .length;

export const selectTotalUnreadCount = (state: RootState) =>
  state.chat.rooms.reduce(
    (total: number, room: ChatRoom) => total + (room.unreadCount || 0),
    0
  );

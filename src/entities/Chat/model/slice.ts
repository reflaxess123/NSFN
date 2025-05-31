import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { ChatMessage, ChatRoom, ChatState } from './types';

const initialState: ChatState = {
  rooms: [],
  currentRoomId: null,
  messages: {},
  isLoading: false,
  error: null,
  onlineUsers: [],
  typingUsers: {},
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setRooms: (state, action: PayloadAction<ChatRoom[]>) => {
      state.rooms = action.payload;
    },

    addRoom: (state, action: PayloadAction<ChatRoom>) => {
      const existingIndex = state.rooms.findIndex(
        (room) => room.id === action.payload.id
      );
      if (existingIndex >= 0) {
        state.rooms[existingIndex] = action.payload;
      } else {
        state.rooms.push(action.payload);
      }
    },

    updateRoom: (state, action: PayloadAction<ChatRoom>) => {
      const index = state.rooms.findIndex(
        (room) => room.id === action.payload.id
      );
      if (index >= 0) {
        state.rooms[index] = action.payload;
      }
    },

    setCurrentRoom: (state, action: PayloadAction<string | null>) => {
      state.currentRoomId = action.payload;
    },

    setRoomMessages: (
      state,
      action: PayloadAction<{ roomId: string; messages: ChatMessage[] }>
    ) => {
      state.messages[action.payload.roomId] = action.payload.messages;
    },

    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { roomId } = action.payload;
      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }
      state.messages[roomId].push(action.payload);

      // Обновляем последнее сообщение в комнате
      const roomIndex = state.rooms.findIndex((room) => room.id === roomId);
      if (roomIndex >= 0) {
        state.rooms[roomIndex].lastMessage = action.payload;
      }
    },

    updateMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { roomId, id } = action.payload;
      const roomMessages = state.messages[roomId];
      if (roomMessages) {
        const messageIndex = roomMessages.findIndex((msg) => msg.id === id);
        if (messageIndex >= 0) {
          roomMessages[messageIndex] = action.payload;
        }
      }
    },

    deleteMessage: (
      state,
      action: PayloadAction<{ messageId: string; roomId: string }>
    ) => {
      const { messageId, roomId } = action.payload;
      const roomMessages = state.messages[roomId];
      if (roomMessages) {
        const messageIndex = roomMessages.findIndex(
          (msg) => msg.id === messageId
        );
        if (messageIndex >= 0) {
          roomMessages.splice(messageIndex, 1);
        }
      }
    },

    setOnlineUsers: (state, action: PayloadAction<number[]>) => {
      state.onlineUsers = action.payload;
    },

    addOnlineUser: (state, action: PayloadAction<number>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },

    removeOnlineUser: (state, action: PayloadAction<number>) => {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload
      );
    },

    setTypingUsers: (
      state,
      action: PayloadAction<{ roomId: string; userIds: number[] }>
    ) => {
      state.typingUsers[action.payload.roomId] = action.payload.userIds;
    },

    addTypingUser: (
      state,
      action: PayloadAction<{ roomId: string; userId: number }>
    ) => {
      const { roomId, userId } = action.payload;
      if (!state.typingUsers[roomId]) {
        state.typingUsers[roomId] = [];
      }
      if (!state.typingUsers[roomId].includes(userId)) {
        state.typingUsers[roomId].push(userId);
      }
    },

    removeTypingUser: (
      state,
      action: PayloadAction<{ roomId: string; userId: number }>
    ) => {
      const { roomId, userId } = action.payload;
      if (state.typingUsers[roomId]) {
        state.typingUsers[roomId] = state.typingUsers[roomId].filter(
          (id) => id !== userId
        );
      }
    },

    clearChat: (state) => {
      state.rooms = [];
      state.currentRoomId = null;
      state.messages = {};
      state.onlineUsers = [];
      state.typingUsers = {};
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setRooms,
  addRoom,
  updateRoom,
  setCurrentRoom,
  setRoomMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setTypingUsers,
  addTypingUser,
  removeTypingUser,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;

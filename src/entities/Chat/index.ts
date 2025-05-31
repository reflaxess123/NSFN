// Типы
export type {
  ChatMessage,
  ChatParticipant,
  ChatRoom,
  ChatState,
  ChatUser,
  CreateRoomRequest,
  SendMessageRequest,
} from './model/types';

// Селекторы
export {
  selectChatError,
  selectChatIsLoading,
  selectChatRooms,
  selectChatState,
  selectCurrentRoom,
  selectCurrentRoomId,
  selectCurrentRoomMessages,
  selectCurrentRoomTypingUsers,
  selectOnlineUsers,
  selectRoomMessages,
  selectTotalUnreadCount,
  selectTypingUsers,
  selectUnreadRoomsCount,
} from './model/selectors';

// Actions
export {
  addMessage,
  addOnlineUser,
  addRoom,
  addTypingUser,
  clearChat,
  deleteMessage,
  removeOnlineUser,
  removeTypingUser,
  setCurrentRoom,
  setError,
  setLoading,
  setOnlineUsers,
  setRoomMessages,
  setRooms,
  setTypingUsers,
  updateMessage,
  updateRoom,
} from './model/slice';

// Reducer
export { default as chatSlice } from './model/slice';

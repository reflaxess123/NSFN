export interface ChatUser {
  id: number;
  email: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: number;
  sender: ChatUser;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  replyToId?: string;
  replyTo?: ChatMessage;
}

export interface ChatParticipant {
  id: string;
  userId: number;
  user: ChatUser;
  joinedAt: string;
  lastReadAt: string;
}

export interface ChatRoom {
  id: string;
  name?: string;
  type: 'PRIVATE' | 'GROUP';
  isActive: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  unreadCount?: number;
}

export interface CreateRoomRequest {
  participantIds: number[];
  name?: string;
  type: 'PRIVATE' | 'GROUP';
}

export interface SendMessageRequest {
  roomId: string;
  content: string;
  messageType?: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  replyToId?: string;
}

export interface ChatState {
  rooms: ChatRoom[];
  currentRoomId: string | null;
  messages: Record<string, ChatMessage[]>;
  isLoading: boolean;
  error: string | null;
  onlineUsers: number[];
  typingUsers: Record<string, number[]>; // roomId -> userIds
}

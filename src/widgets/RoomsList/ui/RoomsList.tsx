import {
  selectChatIsLoading,
  selectChatRooms,
  selectCurrentRoomId,
  setCurrentRoom,
  setError,
  setRooms,
} from '@/entities/Chat';
import { selectUser } from '@/entities/User';
import { CreateRoomModal } from '@/features/CreateRoom';
import { chatApi } from '@/shared/api/chat';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RoomItem } from './RoomItem';
import styles from './RoomsList.module.scss';

export const RoomsList = () => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const rooms = useAppSelector(selectChatRooms);
  const currentRoomId = useAppSelector(selectCurrentRoomId);
  const isLoading = useAppSelector(selectChatIsLoading);
  const currentUser = useAppSelector(selectUser);

  // Загружаем комнаты при монтировании
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const userRooms = await chatApi.getRooms();
      dispatch(setRooms(userRooms));
    } catch {
      dispatch(setError('Не удалось загрузить список чатов'));
    }
  };

  const handleRoomSelect = (roomId: string) => {
    dispatch(setCurrentRoom(roomId));
  };

  const handleRoomCreated = (roomId: string) => {
    // Автоматически выбираем созданную комнату
    dispatch(setCurrentRoom(roomId));
  };

  // Фильтрация комнат по поисковому запросу
  const filteredRooms = rooms.filter((room) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();

    if (room.type === 'GROUP') {
      return room.name?.toLowerCase().includes(query);
    } else {
      // Для приватного чата ищем по email собеседника
      const otherParticipant = room.participants.find(
        (p) => p.user.id !== currentUser?.id
      );
      return otherParticipant?.user.email.toLowerCase().includes(query);
    }
  });

  return (
    <div className={styles.roomsList}>
      <div className={styles.header}>
        <h2 className={styles.title}>Чаты</h2>
        <button
          className={styles.createButton}
          onClick={() => setIsCreateModalOpen(true)}
          aria-label="Создать новый чат"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className={styles.searchContainer}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск чатов..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.roomsContainer}>
        {isLoading && rooms.length === 0 ? (
          <div className={styles.loading}>Загрузка чатов...</div>
        ) : filteredRooms.length === 0 ? (
          <div className={styles.emptyState}>
            {searchQuery ? 'Чаты не найдены' : 'У вас пока нет чатов'}
          </div>
        ) : (
          filteredRooms.map((room) => (
            <RoomItem
              key={room.id}
              room={room}
              isActive={room.id === currentRoomId}
              currentUserId={currentUser?.id}
              onClick={() => handleRoomSelect(room.id)}
            />
          ))
        )}
      </div>

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRoomCreated={handleRoomCreated}
      />
    </div>
  );
};

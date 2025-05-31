import type { ChatUser, CreateRoomRequest } from '@/entities/Chat';
import { addRoom, setError } from '@/entities/Chat';
import { chatApi } from '@/shared/api/chat';
import { useAppDispatch } from '@/shared/hooks/redux';
import { User, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './CreateRoomModal.module.scss';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated?: (roomId: string) => void;
}

export const CreateRoomModal = ({
  isOpen,
  onClose,
  onRoomCreated,
}: CreateRoomModalProps) => {
  const [roomType, setRoomType] = useState<'PRIVATE' | 'GROUP'>('PRIVATE');
  const [roomName, setRoomName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [availableUsers, setAvailableUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useAppDispatch();

  // Загружаем список пользователей при открытии модала
  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      const users = await chatApi.getUsers();
      setAvailableUsers(users);
    } catch {
      dispatch(setError('Не удалось загрузить список пользователей'));
    }
  };

  const handleUserToggle = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUsers.length === 0) {
      dispatch(setError('Выберите хотя бы одного пользователя'));
      return;
    }

    if (roomType === 'GROUP' && !roomName.trim()) {
      dispatch(setError('Введите название группы'));
      return;
    }

    setIsLoading(true);

    try {
      const roomData: CreateRoomRequest = {
        participantIds: selectedUsers,
        type: roomType,
        ...(roomType === 'GROUP' && { name: roomName.trim() }),
      };

      const newRoom = await chatApi.createRoom(roomData);
      dispatch(addRoom(newRoom));

      // Сбрасываем форму
      setRoomName('');
      setSelectedUsers([]);
      setRoomType('PRIVATE');
      setSearchQuery('');

      onRoomCreated?.(newRoom.id);
      onClose();
    } catch {
      dispatch(setError('Не удалось создать комнату'));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = availableUsers.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Создать чат</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X size={24} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Тип комнаты */}
          <div className={styles.section}>
            <label className={styles.label}>Тип чата</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  value="PRIVATE"
                  checked={roomType === 'PRIVATE'}
                  onChange={(e) => setRoomType(e.target.value as 'PRIVATE')}
                />
                <User size={16} />
                Приватный
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  value="GROUP"
                  checked={roomType === 'GROUP'}
                  onChange={(e) => setRoomType(e.target.value as 'GROUP')}
                />
                <Users size={16} />
                Группа
              </label>
            </div>
          </div>

          {/* Название группы */}
          {roomType === 'GROUP' && (
            <div className={styles.section}>
              <label className={styles.label} htmlFor="roomName">
                Название группы
              </label>
              <input
                id="roomName"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Введите название группы"
                className={styles.input}
                maxLength={50}
              />
            </div>
          )}

          {/* Поиск пользователей */}
          <div className={styles.section}>
            <label className={styles.label} htmlFor="userSearch">
              Участники
            </label>
            <input
              id="userSearch"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск пользователей..."
              className={styles.input}
            />
          </div>

          {/* Список пользователей */}
          <div className={styles.usersList}>
            {filteredUsers.map((user) => (
              <label key={user.id} className={styles.userOption}>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleUserToggle(user.id)}
                />
                <div className={styles.userInfo}>
                  <span className={styles.userEmail}>{user.email}</span>
                  {user.isOnline && <span className={styles.onlineIndicator} />}
                </div>
              </label>
            ))}

            {filteredUsers.length === 0 && (
              <div className={styles.emptyState}>
                {searchQuery
                  ? 'Пользователи не найдены'
                  : 'Загрузка пользователей...'}
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.createButton}
              disabled={isLoading || selectedUsers.length === 0}
            >
              {isLoading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

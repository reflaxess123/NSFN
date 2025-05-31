import type { CreateRoomRequest } from '@/entities/Chat';
import { addRoom, setError } from '@/entities/Chat';
import { Modal } from '@/shared/components/Modal';
import { RoleGuard } from '@/shared/components/RoleGuard';
import { useAppDispatch, useChatUsers, useCreateRoom } from '@/shared/hooks';
import { User, Users, X } from 'lucide-react';
import { useState } from 'react';
import styles from './CreateRoomModal.module.scss';

// Определяем размеры модального окна (копируем из Modal.tsx)
enum ModalSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

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
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useAppDispatch();

  // Используем TanStack Query для пользователей
  const {
    data: availableUsers = [],
    isLoading: usersLoading,
    error: usersError,
  } = useChatUsers();

  // Используем TanStack Query мутацию для создания комнаты
  const createRoomMutation = useCreateRoom();

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
      console.error('Ошибка: не выбраны пользователи');
      dispatch(setError('Выберите хотя бы одного пользователя'));
      return;
    }

    if (roomType === 'GROUP' && !roomName.trim()) {
      console.error('Ошибка: не указано название группы');
      dispatch(setError('Введите название группы'));
      return;
    }

    const roomData: CreateRoomRequest = {
      participantIds: selectedUsers,
      type: roomType,
      ...(roomType === 'GROUP' && { name: roomName.trim() }),
    };

    try {
      const newRoom = await createRoomMutation.mutateAsync(roomData);

      dispatch(addRoom(newRoom));

      // Сбрасываем форму
      setRoomName('');
      setSelectedUsers([]);
      setRoomType('PRIVATE');
      setSearchQuery('');

      onRoomCreated?.(newRoom.id);
      onClose();
    } catch (error) {
      console.error('Ошибка при создании комнаты:', error);

      // Более детальная обработка ошибок
      if (error instanceof Error) {
        dispatch(setError(`Не удалось создать комнату: ${error.message}`));
      } else if (typeof error === 'object' && error && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { message?: string }; message?: string };
        };
        const errorMessage =
          axiosError.response?.data?.message || 'Неизвестная ошибка';
        dispatch(setError(`Не удалось создать комнату: ${errorMessage}`));
      } else {
        dispatch(setError('Не удалось создать комнату: неизвестная ошибка'));
      }
    }
  };

  const filteredUsers = availableUsers.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (usersError) {
    console.error('Ошибка загрузки пользователей:', usersError);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={ModalSize.MD}
      closeOnOverlay={true}
      closeOnEsc={true}
    >
      <RoleGuard
        requiredRole="USER"
        fallback={
          <div className={styles.accessDenied}>
            <div className={styles.header}>
              <h2 className={styles.title}>Доступ ограничен</h2>
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Закрыть"
              >
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <p>
                Для создания чатов необходимо быть авторизованным пользователем
              </p>
            </div>
          </div>
        }
      >
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
            {usersLoading ? (
              <div className={styles.emptyState}>Загрузка пользователей...</div>
            ) : filteredUsers.length === 0 ? (
              <div className={styles.emptyState}>
                {searchQuery
                  ? 'Пользователи не найдены'
                  : 'Нет доступных пользователей'}
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedUsers.includes(user.id);
                return (
                  <label
                    key={user.id}
                    className={`${styles.userOption} ${
                      isSelected ? styles.selected : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleUserToggle(user.id)}
                    />
                    <div className={styles.userInfo}>
                      <span className={styles.userEmail}>{user.email}</span>
                      {user.isOnline && (
                        <span className={styles.onlineIndicator} />
                      )}
                    </div>
                  </label>
                );
              })
            )}
          </div>

          {/* Отладочная информация (временно) */}
          <div className={styles.section}>
            <div
              style={{
                padding: '8px',
                background: 'var(--bg-secondary)',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
              }}
            >
              Отладка: Выбрано пользователей: {selectedUsers.length} | Всего
              пользователей: {availableUsers.length} | Тип: {roomType} |
              Название: "{roomName}" | Кнопка заблокирована:{' '}
              {(
                createRoomMutation.isPending || selectedUsers.length === 0
              ).toString()}{' '}
              | isLoading: {createRoomMutation.isPending.toString()}
            </div>
          </div>

          {/* Кнопки */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={createRoomMutation.isPending}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.createButton}
              disabled={
                createRoomMutation.isPending || selectedUsers.length === 0
              }
              onClick={(e) => {
                // Если кнопка заблокирована, не позволяем отправку
                if (
                  createRoomMutation.isPending ||
                  selectedUsers.length === 0
                ) {
                  e.preventDefault();
                  console.error(
                    'Кнопка заблокирована! isLoading:',
                    createRoomMutation.isPending,
                    'selectedUsers.length:',
                    selectedUsers.length
                  );
                  return;
                }
              }}
            >
              {createRoomMutation.isPending ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </RoleGuard>
    </Modal>
  );
};

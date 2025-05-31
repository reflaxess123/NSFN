import { setError, setRooms } from '@/entities/Chat';
import { chatApi } from '@/shared/api/chat';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAppDispatch } from './redux';

// Ключи для кэширования
export const chatQueryKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatQueryKeys.all, 'rooms'] as const,
  users: () => [...chatQueryKeys.all, 'users'] as const,
};

// Хук для получения списка комнат
export const useRooms = () => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: chatQueryKeys.rooms(),
    queryFn: () => chatApi.getRooms(),
    staleTime: 30 * 1000, // 30 секунд
    retry: 3,
  });

  // Синхронизируем с Redux
  useEffect(() => {
    if (query.data) {
      dispatch(setRooms(query.data));
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      dispatch(setError('Не удалось загрузить список чатов'));
    }
  }, [query.error, dispatch]);

  return query;
};

// Хук для получения списка пользователей для создания чата
export const useChatUsers = () => {
  return useQuery({
    queryKey: chatQueryKeys.users(),
    queryFn: () => chatApi.getUsers(),
    staleTime: 2 * 60 * 1000, // 2 минуты
    retry: 3,
  });
};

// Хук для создания комнаты
export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.createRoom,
    onSuccess: () => {
      // Инвалидируем кэш комнат для обновления списка
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
    onError: (error) => {
      console.error('Ошибка создания комнаты:', error);
    },
  });
};

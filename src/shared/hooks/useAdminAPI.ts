import { authApi } from '@/shared/api/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRole } from './useRole';

// Временные мок-данные для тестирования (с прогрессом)
const MOCK_ROADMAP_DATA = {
  categories: [
    {
      name: 'JavaScript',
      contentProgress: 75,
      theoryProgress: 80,
      overallProgress: 77,
      contentStats: { total: 120, completed: 90 },
      theoryStats: { total: 45, completed: 36 },
      subCategories: [
        {
          name: 'Array',
          contentProgress: 85,
          theoryProgress: 90,
          overallProgress: 87,
        },
        {
          name: 'Object',
          contentProgress: 70,
          theoryProgress: 75,
          overallProgress: 72,
        },
        {
          name: 'Functions',
          contentProgress: 80,
          theoryProgress: 85,
          overallProgress: 82,
        },
        {
          name: 'Promises',
          contentProgress: 60,
          theoryProgress: 70,
          overallProgress: 65,
        },
      ],
    },
    {
      name: 'React',
      contentProgress: 45,
      theoryProgress: 30,
      overallProgress: 40,
      contentStats: { total: 95, completed: 43 },
      theoryStats: { total: 30, completed: 9 },
      subCategories: [
        {
          name: 'Hooks',
          contentProgress: 60,
          theoryProgress: 40,
          overallProgress: 55,
        },
        {
          name: 'Components',
          contentProgress: 40,
          theoryProgress: 25,
          overallProgress: 35,
        },
        {
          name: 'State',
          contentProgress: 50,
          theoryProgress: 30,
          overallProgress: 45,
        },
      ],
    },
    {
      name: 'TypeScript',
      contentProgress: 25,
      theoryProgress: 15,
      overallProgress: 22,
      contentStats: { total: 80, completed: 20 },
      theoryStats: { total: 25, completed: 4 },
      subCategories: [
        {
          name: 'Types',
          contentProgress: 30,
          theoryProgress: 20,
          overallProgress: 27,
        },
        {
          name: 'Interfaces',
          contentProgress: 20,
          theoryProgress: 10,
          overallProgress: 17,
        },
        {
          name: 'Generics',
          contentProgress: 15,
          theoryProgress: 5,
          overallProgress: 12,
        },
      ],
    },
  ],
};

// Данные для гостей (без прогресса)
const GUEST_ROADMAP_DATA = {
  categories: [
    {
      name: 'JavaScript',
      contentProgress: 0,
      theoryProgress: 0,
      overallProgress: 0,
      contentStats: { total: 120, completed: 0 },
      theoryStats: { total: 45, completed: 0 },
      subCategories: [
        {
          name: 'Array',
          contentProgress: 0,
          theoryProgress: 0,
          overallProgress: 0,
        },
        {
          name: 'Object',
          contentProgress: 0,
          theoryProgress: 0,
          overallProgress: 0,
        },
        {
          name: 'Functions',
          contentProgress: 0,
          theoryProgress: 0,
          overallProgress: 0,
        },
        {
          name: 'Promises',
          contentProgress: 0,
          theoryProgress: 0,
          overallProgress: 0,
        },
      ],
    },
    {
      name: 'React',
      contentProgress: 0,
      theoryProgress: 0,
      overallProgress: 0,
      contentStats: { total: 95, completed: 0 },
      theoryStats: { total: 30, completed: 0 },
      subCategories: [
        {
          name: 'Hooks',
          contentProgress: 0,
          theoryProgress: 0,
          overallProgress: 0,
        },
        {
          name: 'Components',
          contentProgress: 0,
          theoryProgress: 0,
          overallProgress: 0,
        },
        {
          name: 'State',
          contentProgress: 0,
          theoryProgress: 0,
          overallProgress: 0,
        },
      ],
    },
    {
      name: 'TypeScript',
      contentProgress: 0,
      theoryProgress: 0,
      overallProgress: 0,
      contentStats: { total: 80, completed: 0 },
      theoryStats: { total: 25, completed: 0 },
      subCategories: [
        {
          name: 'Types',
          contentProgress: 0,
          theoryProgress: 0,
          overallProgress: 0,
        },
        {
          name: 'Interfaces',
          contentProgress: 0,
          theoryProgress: 0,
          overallProgress: 0,
        },
        {
          name: 'Generics',
          contentProgress: 0,
          theoryProgress: 0,
          overallProgress: 0,
        },
      ],
    },
  ],
};

// Ключи для кэширования
export const adminQueryKeys = {
  all: ['admin'] as const,
  stats: () => [...adminQueryKeys.all, 'stats'] as const,
  users: () => [...adminQueryKeys.all, 'users'] as const,
  overview: () => [...adminQueryKeys.all, 'overview'] as const,
  contentStats: (params?: { category?: string; includeBlocks?: boolean }) =>
    [...adminQueryKeys.all, 'content-stats', params] as const,
  theoryStats: (params?: { category?: string; includeCards?: boolean }) =>
    [...adminQueryKeys.all, 'theory-stats', params] as const,
  roadmapStats: () => [...adminQueryKeys.all, 'roadmap-stats'] as const,
};

// Хук для получения основной статистики для админ-дашборда
export const useAdminStats = () => {
  return useQuery({
    queryKey: adminQueryKeys.stats(),
    queryFn: () => authApi.admin.getStats(),
    staleTime: 2 * 60 * 1000, // 2 минуты
    retry: 3,
  });
};

// Хук для получения списка пользователей
export const useUsers = () => {
  return useQuery({
    queryKey: adminQueryKeys.users(),
    queryFn: async () => {
      const response = await authApi.admin.getUsers();
      // Адаптируем ответ API к нашему интерфейсу
      if (response.users) {
        return response.users;
      } else if (Array.isArray(response)) {
        return response;
      } else {
        return [];
      }
    },
    staleTime: 1 * 60 * 1000, // 1 минута
    retry: 3,
  });
};

// Хук для получения детальной статистики
export const useDetailedStats = () => {
  return useQuery({
    queryKey: [...adminQueryKeys.stats(), 'detailed'],
    queryFn: async () => {
      // Пока нет метода getDetailedStats, используем обычную статистику
      const response = await authApi.admin.getStats();
      // Дополняем базовую статистику до детальной
      return {
        users: {
          ...response.users,
          activeThisMonth: response.users.total || 0,
          newThisWeek: 0,
          avgSessionTime: 0,
        },
        content: {
          ...response.content,
          categoriesCount: 0,
          avgBlocksPerFile:
            response.content.totalFiles > 0
              ? response.content.totalBlocks / response.content.totalFiles
              : 0,
          recentlyAdded: 0,
        },
        progress: {
          ...response.progress,
          avgProgressPerUser: 0,
          mostActiveUsers: [] as Array<{
            email: string;
            progressCount: number;
          }>,
          topCategories: [] as Array<{
            category: string;
            progressCount: number;
          }>,
        },
        system: {
          uptime: 0,
          responseTime: 0,
          errorRate: 0,
          apiCalls24h: 0,
        },
      };
    },
    staleTime: 2 * 60 * 1000, // 2 минуты
    retry: 3,
  });
};

// Хук для получения статистики обзора
export const useOverviewStats = () => {
  return useQuery({
    queryKey: adminQueryKeys.overview(),
    queryFn: async () => {
      const response = await fetch('/api/stats/overview', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 3,
  });
};

// Хук для получения статистики контента
export const useContentStats = (
  params: {
    category?: string;
    includeBlocks?: boolean;
  } = {}
) => {
  return useQuery({
    queryKey: adminQueryKeys.contentStats(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.category) searchParams.append('category', params.category);
      if (params.includeBlocks) searchParams.append('includeBlocks', 'true');

      const response = await fetch(`/api/stats/content?${searchParams}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: Object.keys(params).length > 0,
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 3,
  });
};

// Хук для получения статистики теории
export const useTheoryStats = (
  params: {
    category?: string;
    includeCards?: boolean;
  } = {}
) => {
  return useQuery({
    queryKey: adminQueryKeys.theoryStats(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.category) searchParams.append('category', params.category);
      if (params.includeCards) searchParams.append('includeCards', 'true');

      const response = await fetch(`/api/stats/theory?${searchParams}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: Object.keys(params).length > 0,
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 3,
  });
};

// Хук для получения статистики роадмапа
export const useRoadmapStats = () => {
  const { isGuest } = useRole();

  return useQuery({
    queryKey: adminQueryKeys.roadmapStats(),
    queryFn: async () => {
      // Временно используем мок-данные для тестирования интерфейса
      // Раскомментируйте следующие строки когда бэкенд будет готов:
      /*
      // Для гостей не делаем запрос к API
      if (!isGuest) {
        const response = await fetch('/api/stats/roadmap', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      }
      */

      // Имитируем задержку сети
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Возвращаем данные в зависимости от роли пользователя
      return isGuest ? GUEST_ROADMAP_DATA : MOCK_ROADMAP_DATA;
    },
    staleTime: 10 * 60 * 1000, // 10 минут
    retry: 3,
  });
};

// Хук для изменения роли пользователя
export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      newRole,
    }: {
      userId: number;
      newRole: 'USER' | 'ADMIN';
    }) => {
      return authApi.admin.updateUser(userId, { role: newRole });
    },
    onSuccess: () => {
      // Инвалидируем кэш пользователей для обновления списка
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() });
    },
    onError: (error) => {
      console.error('Ошибка изменения роли:', error);
    },
  });
};

// Хук для удаления пользователя
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => {
      return authApi.admin.deleteUser(userId);
    },
    onSuccess: () => {
      // Инвалидируем кэш пользователей для обновления списка
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() });
      // Также обновляем статистику
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
    },
    onError: (error) => {
      console.error('Ошибка удаления пользователя:', error);
    },
  });
};

import { theoryCardsApi } from '@/shared/api/theory-cards';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { TheoryCardsQueryParams, UpdateProgressRequest } from './types';

const useTheoryCards = (params: TheoryCardsQueryParams) => {
  return useQuery({
    queryKey: ['theory-cards', params], // ключ для кеша
    queryFn: () => theoryCardsApi.getTheoryCards(params), // функция запроса
  });
};

// Хук для бесконечного скролла
const useInfiniteTheoryCards = (
  params: Omit<TheoryCardsQueryParams, 'page'>
) => {
  return useInfiniteQuery({
    queryKey: ['theory-cards-infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      theoryCardsApi.getTheoryCards({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Хук для получения категорий
const useCategories = () => {
  return useQuery({
    queryKey: ['theory-categories'],
    queryFn: () => theoryCardsApi.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

// Хук для обновления прогресса
const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      data,
    }: {
      cardId: string;
      data: UpdateProgressRequest;
    }) => theoryCardsApi.updateProgress(cardId, data),
    onSuccess: () => {
      // Обновляем кеш для всех запросов карточек
      queryClient.invalidateQueries({ queryKey: ['theory-cards'] });
      queryClient.invalidateQueries({ queryKey: ['theory-cards-infinite'] });
    },
  });
};

export {
  useCategories,
  useInfiniteTheoryCards,
  useTheoryCards,
  useUpdateProgress,
};

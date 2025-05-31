import { theoryCardsApi } from '@/shared/api/theory-cards';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type {
  TheoryCard,
  TheoryCardsQueryParams,
  TheoryCardsResponse,
  UpdateProgressRequest,
} from './types';

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
    onSuccess: (response, variables) => {
      // Обновляем данные напрямую в кеше без инвалидации
      // Это избегает race condition между локальным обновлением и новым запросом

      // Обновляем infinite queries
      queryClient.setQueriesData<{
        pages: TheoryCardsResponse[];
        pageParams: unknown[];
      }>({ queryKey: ['theory-cards-infinite'] }, (oldData) => {
        if (!oldData) return oldData;

        // Для infinite queries обновляем в pages
        if ('pages' in oldData && oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: TheoryCardsResponse) => ({
              ...page,
              cards: page.cards.map((card: TheoryCard) =>
                card.id === variables.cardId
                  ? { ...card, currentUserSolvedCount: response.solvedCount }
                  : card
              ),
            })),
          };
        }

        return oldData;
      });

      // Обновляем обычные queries
      queryClient.setQueriesData<TheoryCardsResponse>(
        { queryKey: ['theory-cards'] },
        (oldData) => {
          if (!oldData) return oldData;

          // Для обычных queries обновляем в cards
          if ('cards' in oldData && oldData.cards) {
            return {
              ...oldData,
              cards: oldData.cards.map((card: TheoryCard) =>
                card.id === variables.cardId
                  ? { ...card, currentUserSolvedCount: response.solvedCount }
                  : card
              ),
            };
          }

          return oldData;
        }
      );
    },
  });
};

export {
  useCategories,
  useInfiniteTheoryCards,
  useTheoryCards,
  useUpdateProgress,
};

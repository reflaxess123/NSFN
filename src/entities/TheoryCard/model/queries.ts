import { theoryCardsApi } from '@/shared/api/theory-cards';
import { useQuery } from '@tanstack/react-query';
import type { TheoryCardsQueryParams } from './types';

const useTheoryCards = (params: TheoryCardsQueryParams) => {
  return useQuery({
    queryKey: ['theory-cards', params], // ключ для кеша
    queryFn: () => theoryCardsApi.getTheoryCards(params), // функция запроса
  });
};

export { useTheoryCards };

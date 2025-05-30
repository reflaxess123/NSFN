import type {
  TheoryCardsQueryParams,
  TheoryCardsResponse,
} from '@/entities/TheoryCard/model/types';
import { apiInstance } from './base';

export const theoryCardsApi = {
  async getTheoryCards(params: TheoryCardsQueryParams) {
    const response = await apiInstance.get<TheoryCardsResponse>(
      '/api/theory/cards',
      {
        params,
      }
    );
    return response.data;
  },
};

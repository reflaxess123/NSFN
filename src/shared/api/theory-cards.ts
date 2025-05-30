import type {
  Category,
  TheoryCardsQueryParams,
  TheoryCardsResponse,
  UpdateProgressRequest,
  UpdateProgressResponse,
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

  async getCategories() {
    const response = await apiInstance.get<Category[]>(
      '/api/theory/categories'
    );
    return response.data;
  },

  async updateProgress(cardId: string, data: UpdateProgressRequest) {
    const response = await apiInstance.patch<UpdateProgressResponse>(
      `/api/theory/cards/${cardId}/progress`,
      data
    );
    return response.data;
  },
};

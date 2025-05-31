import type {
  Category,
  TheoryCardsQueryParams,
  TheoryCardsResponse,
  UpdateProgressRequest,
  UpdateProgressResponse,
} from '@/entities/TheoryCard/model/types';
import { apiInstance } from './base';

// Тип для ответа сервера (с progressEntries)
interface ServerTheoryCard {
  id: string;
  ankiGuid: string;
  cardType: string;
  deck: string;
  category: string;
  subCategory: string | null;
  questionBlock: string;
  answerBlock: string;
  tags: string[];
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  progressEntries: Array<{
    solvedCount: number;
    // ... другие поля прогресса
  }>;
}

interface ServerTheoryCardsResponse {
  cards: ServerTheoryCard[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export const theoryCardsApi = {
  async getTheoryCards(
    params: TheoryCardsQueryParams
  ): Promise<TheoryCardsResponse> {
    const response = await apiInstance.get<ServerTheoryCardsResponse>(
      '/api/theory/cards',
      {
        params,
      }
    );

    // Преобразуем данные сервера в нужный формат
    const transformedData: TheoryCardsResponse = {
      cards: response.data.cards.map((card) => ({
        ...card,
        // Извлекаем solvedCount из первого элемента progressEntries или ставим 0
        currentUserSolvedCount:
          card.progressEntries && card.progressEntries.length > 0
            ? card.progressEntries[0].solvedCount
            : 0,
      })),
      pagination: response.data.pagination,
    };

    return transformedData;
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

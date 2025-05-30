// Основная сущность карточки
export interface TheoryCard {
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
  currentUserSolvedCount: number;
}

// Информация о пагинации
export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

// Ответ API для получения карточек
export interface TheoryCardsResponse {
  data: TheoryCard[];
  pagination: Pagination;
}

// Параметры запроса для фильтрации и поиска
export interface TheoryCardsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  subCategory?: string;
  deck?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  q?: string; // полнотекстовый поиск
  onlyUnstudied?: boolean;
}

// Тип для сортировки (можете расширить по необходимости)
export type SortField = 'orderIndex' | 'createdAt' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

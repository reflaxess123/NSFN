import type {
  ContentBlock,
  ContentBlocksFilters,
  ContentBlocksResponse,
  ContentCategory,
  ContentProgressResponse,
  ContentProgressUpdate,
} from '@/entities/ContentBlock';
import { apiInstance } from './base';

class ContentAPI {
  // Получение списка блоков контента с фильтрацией и пагинацией
  async getBlocks(
    filters: ContentBlocksFilters = {}
  ): Promise<ContentBlocksResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiInstance.get(
      `/api/content/blocks?${params.toString()}`
    );
    return response.data;
  }

  // Получение конкретного блока по ID
  async getBlock(blockId: string): Promise<ContentBlock> {
    const response = await apiInstance.get(`/api/content/blocks/${blockId}`);
    return response.data;
  }

  // Обновление прогресса пользователя для блока
  async updateProgress(
    blockId: string,
    data: ContentProgressUpdate
  ): Promise<ContentProgressResponse> {
    const response = await apiInstance.patch(
      `/api/content/blocks/${blockId}/progress`,
      data
    );
    return response.data;
  }

  // Получение иерархии категорий
  async getCategories(): Promise<ContentCategory[]> {
    const response = await apiInstance.get('/api/content/categories');
    return response.data;
  }

  // Поиск блоков по тексту
  async searchBlocks(
    query: string,
    filters: Omit<ContentBlocksFilters, 'q'> = {}
  ): Promise<ContentBlocksResponse> {
    return this.getBlocks({ ...filters, q: query });
  }

  // Получение блоков по категории
  async getBlocksByCategory(
    mainCategory: string,
    subCategory?: string,
    filters: Omit<ContentBlocksFilters, 'mainCategory' | 'subCategory'> = {}
  ): Promise<ContentBlocksResponse> {
    return this.getBlocks({
      ...filters,
      mainCategory,
      ...(subCategory && { subCategory }),
    });
  }

  // Получение блоков с пагинацией (для бесконечного скролла)
  async getMoreBlocks(
    currentPage: number,
    filters: ContentBlocksFilters = {}
  ): Promise<ContentBlocksResponse> {
    return this.getBlocks({ ...filters, page: currentPage + 1 });
  }
}

export const contentApi = new ContentAPI();

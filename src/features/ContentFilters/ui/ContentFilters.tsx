import {
  selectContentBlocksFilters,
  setFilters,
  type ContentBlocksFilters,
} from '@/entities/ContentBlock';
import { ButtonVariant } from '@/shared/components/Button/model/types';
import { Button } from '@/shared/components/Button/ui/Button';
import { Input } from '@/shared/components/Input';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { useContentCategories } from '@/shared/hooks/useContentBlocks';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './ContentFilters.module.scss';

interface ContentFiltersProps {
  onFiltersChange?: (filters: ContentBlocksFilters) => void;
  className?: string;
}

export const ContentFilters = ({
  onFiltersChange,
  className,
}: ContentFiltersProps) => {
  const dispatch = useAppDispatch();
  const currentFilters = useAppSelector(selectContentBlocksFilters);
  const { data: categories } = useContentCategories();

  console.log('Загруженные категории:', categories);

  const [localFilters, setLocalFilters] =
    useState<ContentBlocksFilters>(currentFilters);

  // Синхронизируем локальные фильтры с Redux
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (
    key: keyof ContentBlocksFilters,
    value: string | number | boolean | undefined
  ) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    // Применяем фильтры сразу для лучшего UX
    dispatch(setFilters(newFilters));
    onFiltersChange?.(newFilters);
  };

  const handleMainCategoryChange = (mainCategory: string) => {
    console.log('Изменение основной категории:', mainCategory);
    const newFilters = {
      ...localFilters,
      mainCategory: mainCategory || undefined,
      subCategory: undefined, // Сбрасываем подкатегорию при изменении основной категории
    };
    console.log('Новые фильтры:', newFilters);
    setLocalFilters(newFilters);
    dispatch(setFilters(newFilters));
    onFiltersChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters: ContentBlocksFilters = {
      page: 1,
      limit: 20,
      sortBy: 'orderInFile' as const,
      sortOrder: 'asc' as const,
      q: undefined,
      mainCategory: undefined,
      subCategory: undefined,
      onlyUnsolved: undefined,
    };
    dispatch(setFilters(resetFilters));
    setLocalFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Поиск уже применяется автоматически при изменении
  };

  const getSubCategories = (mainCategory: string) => {
    return (
      categories?.find((cat) => cat.name === mainCategory)?.subCategories || []
    );
  };

  const hasActiveFilters = () => {
    return !!(
      localFilters.q ||
      localFilters.onlyUnsolved ||
      localFilters.mainCategory ||
      localFilters.subCategory
    );
  };

  return (
    <div className={`${styles.contentFilters} ${className || ''}`}>
      {/* Поиск */}
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <Input
            type="text"
            placeholder="Поиск по контенту..."
            value={localFilters.q || ''}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            className={styles.searchInput}
          />
          {localFilters.q && (
            <button
              type="button"
              onClick={() => handleFilterChange('q', '')}
              className={styles.clearSearch}
              aria-label="Очистить поиск"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Фильтры */}
      <div className={styles.filtersRow}>
        {/* Основная категория */}
        <div className={styles.filterGroup}>
          <select
            value={localFilters.mainCategory || ''}
            onChange={(e) => handleMainCategoryChange(e.target.value || '')}
            className={styles.filterSelect}
          >
            <option value="">Все категории</option>
            {categories?.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Подкатегория */}
        {localFilters.mainCategory && (
          <div className={styles.filterGroup}>
            <select
              value={localFilters.subCategory || ''}
              onChange={(e) =>
                handleFilterChange('subCategory', e.target.value || undefined)
              }
              className={styles.filterSelect}
            >
              <option value="">Все подкатегории</option>
              {getSubCategories(localFilters.mainCategory).map(
                (subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
                  </option>
                )
              )}
            </select>
          </div>
        )}

        {/* Фильтр "Только нерешенные" */}
        <label className={styles.checkboxFilter}>
          <input
            type="checkbox"
            checked={localFilters.onlyUnsolved || false}
            onChange={(e) =>
              handleFilterChange('onlyUnsolved', e.target.checked)
            }
            className={styles.checkbox}
          />
          <span className={styles.checkboxLabel}>Только нерешенные</span>
        </label>

        {/* Кнопка сброса фильтров */}
        {hasActiveFilters() && (
          <Button
            type="button"
            variant={ButtonVariant.GHOST}
            onClick={handleReset}
            className={styles.resetButton}
          >
            Сбросить
          </Button>
        )}
      </div>
    </div>
  );
};

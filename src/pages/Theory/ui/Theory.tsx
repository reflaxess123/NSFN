import {
  InfiniteTheoryCards,
  TheoryFiltersComponent,
  type TheoryFilters,
} from '@/entities/TheoryCard';
import { PageWrapper } from '@/shared/components/PageWrapper';
import { useState } from 'react';
import styles from './Theory.module.scss';

const Theory = () => {
  const [filters, setFilters] = useState<TheoryFilters>({
    sortBy: 'orderIndex',
    sortOrder: 'asc',
  });

  const handleFiltersChange = (newFilters: TheoryFilters) => {
    setFilters(newFilters);
  };

  return (
    <PageWrapper>
      <div className={styles.theory}>
        <div className={styles.container}>
          <div className={styles.title}>
            <h1>Теория</h1>
          </div>

          <TheoryFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          <InfiniteTheoryCards filters={filters} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Theory;

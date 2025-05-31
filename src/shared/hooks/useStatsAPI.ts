import { useCallback, useState } from 'react';

// Временные мок-данные для тестирования
const MOCK_ROADMAP_DATA = {
  categories: [
    {
      name: 'JavaScript',
      contentProgress: 75,
      theoryProgress: 80,
      overallProgress: 77,
      contentStats: { total: 120, completed: 90 },
      theoryStats: { total: 45, completed: 36 },
      subCategories: [
        {
          name: 'Array',
          contentProgress: 85,
          theoryProgress: 90,
          overallProgress: 87,
        },
        {
          name: 'Object',
          contentProgress: 70,
          theoryProgress: 75,
          overallProgress: 72,
        },
        {
          name: 'Functions',
          contentProgress: 80,
          theoryProgress: 85,
          overallProgress: 82,
        },
        {
          name: 'Promises',
          contentProgress: 60,
          theoryProgress: 70,
          overallProgress: 65,
        },
      ],
    },
    {
      name: 'React',
      contentProgress: 45,
      theoryProgress: 30,
      overallProgress: 40,
      contentStats: { total: 95, completed: 43 },
      theoryStats: { total: 30, completed: 9 },
      subCategories: [
        {
          name: 'Hooks',
          contentProgress: 60,
          theoryProgress: 40,
          overallProgress: 55,
        },
        {
          name: 'Components',
          contentProgress: 40,
          theoryProgress: 25,
          overallProgress: 35,
        },
        {
          name: 'State',
          contentProgress: 50,
          theoryProgress: 30,
          overallProgress: 45,
        },
      ],
    },
    {
      name: 'TypeScript',
      contentProgress: 25,
      theoryProgress: 15,
      overallProgress: 22,
      contentStats: { total: 80, completed: 20 },
      theoryStats: { total: 25, completed: 4 },
      subCategories: [
        {
          name: 'Types',
          contentProgress: 30,
          theoryProgress: 20,
          overallProgress: 27,
        },
        {
          name: 'Interfaces',
          contentProgress: 20,
          theoryProgress: 10,
          overallProgress: 17,
        },
        {
          name: 'Generics',
          contentProgress: 15,
          theoryProgress: 5,
          overallProgress: 12,
        },
      ],
    },
  ],
};

export const useStatsAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stats/overview', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContentStats = useCallback(
    async (
      params: {
        category?: string;
        includeBlocks?: boolean;
      } = {}
    ) => {
      setLoading(true);
      setError(null);

      try {
        const searchParams = new URLSearchParams();
        if (params.category) searchParams.append('category', params.category);
        if (params.includeBlocks) searchParams.append('includeBlocks', 'true');

        const response = await fetch(`/api/stats/content?${searchParams}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchTheoryStats = useCallback(
    async (
      params: {
        category?: string;
        includeCards?: boolean;
      } = {}
    ) => {
      setLoading(true);
      setError(null);

      try {
        const searchParams = new URLSearchParams();
        if (params.category) searchParams.append('category', params.category);
        if (params.includeCards) searchParams.append('includeCards', 'true');

        const response = await fetch(`/api/stats/theory?${searchParams}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchRoadmapStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Временно используем мок-данные для тестирования интерфейса
      // Раскомментируйте следующие строки когда бэкенд будет готов:
      /*
      const response = await fetch('/api/stats/roadmap', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
      */

      // Имитируем задержку сети
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return MOCK_ROADMAP_DATA;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchOverview,
    fetchContentStats,
    fetchTheoryStats,
    fetchRoadmapStats,
  };
};

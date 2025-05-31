import { useTheme } from '@/shared/context';
import { useRoadmapStats } from '@/shared/hooks/useAdminAPI';
import { useRole } from '@/shared/hooks/useRole';
import Konva from 'konva';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Group, Layer, Line, Rect, Stage, Text } from 'react-konva';
import styles from './RoadMap.module.scss';

interface RoadmapCategory {
  name: string;
  contentProgress: number;
  theoryProgress: number;
  overallProgress: number;
  contentStats: { total: number; completed: number };
  theoryStats: { total: number; completed: number };
  subCategories: Array<{
    name: string;
    contentProgress: number;
    theoryProgress: number;
    overallProgress: number;
  }>;
}

const RoadMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [, forceUpdate] = useState({});
  const { theme } = useTheme();
  const { isGuest } = useRole();

  const { data, isLoading: loading, error } = useRoadmapStats();
  const categories = data?.categories || [];

  // Цвета в зависимости от темы
  const getThemeColors = () => {
    if (theme === 'dark') {
      return {
        categoryBg: 'rgba(55, 65, 81, 0.9)',
        categoryBorder: '#4527a0',
        subCategoryBg: 'rgba(31, 41, 55, 0.8)',
        subCategoryBorder: '#3700b3',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(156, 163, 175, 0.9)',
        connectionLine: 'rgba(107, 114, 128, 0.8)',
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        progressBg: 'rgba(75, 85, 99, 0.5)',
      };
    } else {
      return {
        categoryBg: 'rgba(255, 255, 255, 0.95)',
        categoryBorder: '#3b82f6',
        subCategoryBg: 'rgba(248, 250, 252, 0.9)',
        subCategoryBorder: '#64748b',
        textPrimary: '#1f2937',
        textSecondary: 'rgba(75, 85, 99, 0.8)',
        connectionLine: 'rgba(107, 114, 128, 0.6)',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        progressBg: 'rgba(203, 213, 225, 0.5)',
      };
    }
  };

  // Автоматически центрируем роадмап после загрузки данных
  useEffect(() => {
    if (categories.length > 0) {
      setTimeout(() => {
        centerRoadmap();
      }, 100);
    }
  }, [categories.length]);

  // Обработка изменения размера контейнера
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newSize = {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        };
        setStageSize(newSize);

        // Перецентрируем роадмап при изменении размера
        if (categories.length > 0) {
          setTimeout(() => {
            centerRoadmap();
          }, 50);
        }
      }
    };

    handleResize(); // Устанавливаем начальный размер
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [categories.length]);

  // Сброс позиции к центру
  const resetView = () => {
    const stage = stageRef.current;
    if (stage) {
      stage.scale({ x: 1, y: 1 });
      centerRoadmap(); // Центрируем вместо сброса к 0,0
    }
  };

  // Функция для получения цвета прогресса
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10b981'; // green
    if (progress >= 60) return '#f59e0b'; // yellow
    if (progress >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  // Функция для центрирования роадмапа
  const centerRoadmap = () => {
    const stage = stageRef.current;
    if (!stage || categories.length === 0) return;

    // Рассчитываем размеры контента
    const nodeWidth = 240;
    const nodeHeight = 140;
    const spacing = 120;
    const cols = 3;
    const rows = Math.ceil(categories.length / cols);

    const contentWidth = cols * nodeWidth + (cols - 1) * spacing;
    const contentHeight = rows * (nodeHeight + spacing * 2);

    // Центрируем относительно видимой области
    const centerX = stageSize.width / 2 - contentWidth / 2;
    const centerY = stageSize.height / 2 - contentHeight / 2;

    stage.position({ x: centerX, y: centerY });
    forceUpdate({}); // Обновляем сетку
  };

  // Компонент категории
  const CategoryNode = ({
    category,
    x,
    y,
  }: {
    category: RoadmapCategory;
    x: number;
    y: number;
  }) => {
    const nodeWidth = 240;
    const nodeHeight = 140;
    const progress = isGuest ? 0 : category.overallProgress;
    const progressColor = isGuest ? '#6b7280' : getProgressColor(progress);
    const colors = getThemeColors();

    return (
      <Group x={x} y={y}>
        {/* Тень */}
        <Rect
          x={4}
          y={4}
          width={nodeWidth}
          height={nodeHeight}
          fill={colors.shadowColor}
          cornerRadius={16}
        />

        {/* Фон узла с градиентом */}
        <Rect
          width={nodeWidth}
          height={nodeHeight}
          fill={colors.categoryBg}
          stroke={progressColor}
          strokeWidth={2}
          cornerRadius={16}
          shadowColor={colors.shadowColor}
          shadowBlur={10}
          shadowOffset={{ x: 0, y: 4 }}
        />

        {/* Прогресс-бар фон - только для авторизованных */}
        {!isGuest && (
          <Rect
            x={16}
            y={nodeHeight - 24}
            width={nodeWidth - 32}
            height={8}
            fill={colors.progressBg}
            cornerRadius={4}
          />
        )}

        {/* Прогресс-бар - только для авторизованных */}
        {!isGuest && (
          <Rect
            x={16}
            y={nodeHeight - 24}
            width={((nodeWidth - 32) * progress) / 100}
            height={8}
            fill={progressColor}
            cornerRadius={4}
            shadowColor={progressColor}
            shadowBlur={4}
          />
        )}

        {/* Название категории */}
        <Text
          x={0}
          y={20}
          text={category.name}
          fontSize={18}
          fontStyle="bold"
          fill={colors.textPrimary}
          width={nodeWidth}
          align="center"
          shadowColor={colors.shadowColor}
          shadowBlur={2}
        />

        {/* Процент прогресса или приглашение для гостей */}
        {!isGuest ? (
          <Text
            x={0}
            y={45}
            text={`${progress}%`}
            fontSize={14}
            fontStyle="bold"
            fill={progressColor}
            width={nodeWidth}
            align="center"
          />
        ) : (
          <Text
            x={0}
            y={45}
            text="Войдите для отслеживания"
            fontSize={12}
            fill={colors.textSecondary}
            width={nodeWidth}
            align="center"
          />
        )}

        {/* Статистика контента */}
        <Text
          x={0}
          y={isGuest ? 70 : 70}
          text={
            isGuest
              ? `Всего материалов: ${category.contentStats.total}`
              : `Контент: ${category.contentStats.completed}/${category.contentStats.total}`
          }
          fontSize={11}
          fill={colors.textSecondary}
          width={nodeWidth}
          align="center"
        />

        {/* Статистика теории */}
        <Text
          x={0}
          y={isGuest ? 88 : 88}
          text={
            isGuest
              ? `Всего теории: ${category.theoryStats.total}`
              : `Теория: ${category.theoryStats.completed}/${category.theoryStats.total}`
          }
          fontSize={11}
          fill={colors.textSecondary}
          width={nodeWidth}
          align="center"
        />
      </Group>
    );
  };

  // Компонент подкатегории
  const SubCategoryNode = ({
    subCategory,
    x,
    y,
  }: {
    subCategory: { name: string; overallProgress: number };
    x: number;
    y: number;
  }) => {
    const nodeWidth = 120;
    const nodeHeight = 70;
    const progress = isGuest ? 0 : subCategory.overallProgress;
    const progressColor = isGuest ? '#6b7280' : getProgressColor(progress);
    const colors = getThemeColors();

    return (
      <Group x={x} y={y}>
        {/* Тень */}
        <Rect
          x={2}
          y={2}
          width={nodeWidth}
          height={nodeHeight}
          fill={colors.shadowColor}
          cornerRadius={12}
        />

        {/* Фон узла */}
        <Rect
          width={nodeWidth}
          height={nodeHeight}
          fill={colors.subCategoryBg}
          stroke={progressColor}
          strokeWidth={1.5}
          cornerRadius={12}
          shadowColor={colors.shadowColor}
          shadowBlur={6}
          shadowOffset={{ x: 0, y: 2 }}
        />

        {/* Прогресс-бар фон - только для авторизованных */}
        {!isGuest && (
          <Rect
            x={10}
            y={nodeHeight - 16}
            width={nodeWidth - 20}
            height={6}
            fill={colors.progressBg}
            cornerRadius={3}
          />
        )}

        {/* Прогресс-бар - только для авторизованных */}
        {!isGuest && (
          <Rect
            x={10}
            y={nodeHeight - 16}
            width={((nodeWidth - 20) * progress) / 100}
            height={6}
            fill={progressColor}
            cornerRadius={3}
            shadowColor={progressColor}
            shadowBlur={3}
          />
        )}

        {/* Название подкатегории */}
        <Text
          x={0}
          y={18}
          text={subCategory.name}
          fontSize={13}
          fontStyle="bold"
          fill={colors.textPrimary}
          width={nodeWidth}
          align="center"
          shadowColor={colors.shadowColor}
          shadowBlur={1}
        />

        {/* Процент прогресса или сообщение для гостей */}
        {!isGuest ? (
          <Text
            x={0}
            y={38}
            text={`${progress}%`}
            fontSize={10}
            fontStyle="bold"
            fill={progressColor}
            width={nodeWidth}
            align="center"
          />
        ) : (
          <Text
            x={0}
            y={38}
            text="📊"
            fontSize={12}
            fill={colors.textSecondary}
            width={nodeWidth}
            align="center"
          />
        )}
      </Group>
    );
  };

  // Компонент соединительной линии
  const Connection = ({
    x1,
    y1,
    x2,
    y2,
  }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }) => {
    const colors = getThemeColors();

    return (
      <Group>
        {/* Тень линии */}
        <Line
          points={[x1 + 1, y1 + 1, x2 + 1, y2 + 1]}
          stroke={colors.shadowColor}
          strokeWidth={3}
          dash={[8, 8]}
        />
        {/* Основная линия */}
        <Line
          points={[x1, y1, x2, y2]}
          stroke={colors.connectionLine}
          strokeWidth={2}
          dash={[8, 8]}
          shadowColor={colors.shadowColor}
          shadowBlur={4}
        />
      </Group>
    );
  };

  // Компонент бесконечной сеточки
  const Grid = () => {
    const colors = getThemeColors();
    const smallGridSize = 25; // Размер мелкой сетки
    const largeGridSize = 100; // Размер крупной сетки
    const lines: React.ReactNode[] = [];

    // Получаем текущую позицию и масштаб stage
    const stage = stageRef.current;
    if (!stage) return <Group>{lines}</Group>;

    const scale = stage.scaleX();
    const pos = stage.position();

    // Рассчитываем видимую область с запасом
    const padding = 1000; // Запас для плавного скроллинга
    const visibleLeft = -pos.x / scale - padding;
    const visibleTop = -pos.y / scale - padding;
    const visibleRight = (stageSize.width - pos.x) / scale + padding;
    const visibleBottom = (stageSize.height - pos.y) / scale + padding;

    // Округляем до ближайших координат сетки
    const startX = Math.floor(visibleLeft / smallGridSize) * smallGridSize;
    const endX = Math.ceil(visibleRight / smallGridSize) * smallGridSize;
    const startY = Math.floor(visibleTop / smallGridSize) * smallGridSize;
    const endY = Math.ceil(visibleBottom / smallGridSize) * smallGridSize;

    // Мелкие вертикальные линии
    for (let i = startX; i <= endX; i += smallGridSize) {
      lines.push(
        <Line
          key={`v-small-${i}`}
          points={[i, startY, i, endY]}
          stroke={colors.connectionLine}
          strokeWidth={0.3}
          opacity={0.15}
        />
      );
    }

    // Мелкие горизонтальные линии
    for (let i = startY; i <= endY; i += smallGridSize) {
      lines.push(
        <Line
          key={`h-small-${i}`}
          points={[startX, i, endX, i]}
          stroke={colors.connectionLine}
          strokeWidth={0.3}
          opacity={0.15}
        />
      );
    }

    // Крупные вертикальные линии
    const startXLarge = Math.floor(visibleLeft / largeGridSize) * largeGridSize;
    const endXLarge = Math.ceil(visibleRight / largeGridSize) * largeGridSize;
    const startYLarge = Math.floor(visibleTop / largeGridSize) * largeGridSize;
    const endYLarge = Math.ceil(visibleBottom / largeGridSize) * largeGridSize;

    for (let i = startXLarge; i <= endXLarge; i += largeGridSize) {
      lines.push(
        <Line
          key={`v-large-${i}`}
          points={[i, startYLarge, i, endYLarge]}
          stroke={colors.connectionLine}
          strokeWidth={0.8}
          opacity={0.4}
        />
      );
    }

    // Крупные горизонтальные линии
    for (let i = startYLarge; i <= endYLarge; i += largeGridSize) {
      lines.push(
        <Line
          key={`h-large-${i}`}
          points={[startXLarge, i, endXLarge, i]}
          stroke={colors.connectionLine}
          strokeWidth={0.8}
          opacity={0.4}
        />
      );
    }

    return <Group>{lines}</Group>;
  };

  if (loading) {
    return (
      <div className={styles.roadMap}>
        <div className={styles.loading}>
          <Loader2 size={32} className={styles.spinner} />
          <p>Загрузка роадмапа...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.roadMap}>
        <div className={styles.error}>
          <AlertCircle size={32} className={styles.errorIcon} />
          <h3>Ошибка загрузки</h3>
          <p>{error instanceof Error ? error.message : String(error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.roadMap}>
      <div className={styles.header}>
        <h1>Роадмап обучения</h1>
        <div className={styles.controls}>
          <p>Перемещение: перетаскивание мышью</p>
          <p>Масштабирование: колесико мыши</p>
          <button onClick={resetView} className={styles.resetButton}>
            Сбросить позицию
          </button>
        </div>
      </div>

      <div ref={containerRef} className={styles.canvasContainer}>
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          draggable
          onDragEnd={() => {
            // Принудительно обновляем сетку при перемещении
            forceUpdate({});
          }}
          onWheel={(e) => {
            e.evt.preventDefault();

            const stage = e.target.getStage();
            if (!stage) return;

            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();
            if (!pointer) return;

            const mousePointTo = {
              x: (pointer.x - stage.x()) / oldScale,
              y: (pointer.y - stage.y()) / oldScale,
            };

            const newScale = e.evt.deltaY > 0 ? oldScale * 0.9 : oldScale * 1.1;
            const clampedScale = Math.max(0.1, Math.min(3, newScale));

            stage.scale({ x: clampedScale, y: clampedScale });

            const newPos = {
              x: pointer.x - mousePointTo.x * clampedScale,
              y: pointer.y - mousePointTo.y * clampedScale,
            };

            stage.position(newPos);

            // Принудительно обновляем сетку при масштабировании
            forceUpdate({});
          }}
        >
          <Layer>
            {/* Сеточка на фоне */}
            <Grid />

            {categories.map((category, index) => {
              const nodeWidth = 240;
              const nodeHeight = 140;
              const spacing = 120;
              const startX = 60;
              const startY = 120; // Отступ от заголовка

              const x = startX + (index % 3) * (nodeWidth + spacing);
              const y =
                startY + Math.floor(index / 3) * (nodeHeight + spacing * 2);

              return (
                <Group key={category.name}>
                  {/* Основная категория */}
                  <CategoryNode category={category} x={x} y={y} />

                  {/* Подкатегории */}
                  {category.subCategories.map((subCat, subIndex) => {
                    const subNodeWidth = 120;
                    const subX = x + (subIndex % 2) * (subNodeWidth + 30);
                    const subY =
                      y + nodeHeight + 50 + Math.floor(subIndex / 2) * 90;

                    return (
                      <Group key={subCat.name}>
                        <SubCategoryNode
                          subCategory={subCat}
                          x={subX}
                          y={subY}
                        />
                        {/* Соединительная линия */}
                        <Connection
                          x1={x + nodeWidth / 2}
                          y1={y + nodeHeight}
                          x2={subX + subNodeWidth / 2}
                          y2={subY}
                        />
                      </Group>
                    );
                  })}
                </Group>
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default RoadMap;

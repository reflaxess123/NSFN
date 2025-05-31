import { useStatsAPI } from '@/shared/hooks/useStatsAPI';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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

interface CanvasPosition {
  x: number;
  y: number;
}

interface ViewportState {
  scale: number;
  offset: CanvasPosition;
}

const RoadMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<RoadmapCategory[]>([]);
  const [viewport, setViewport] = useState<ViewportState>({
    scale: 1,
    offset: { x: 0, y: 0 },
  });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<CanvasPosition>({
    x: 0,
    y: 0,
  });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const { fetchRoadmapStats, loading, error } = useStatsAPI();

  // Загрузка данных
  useEffect(() => {
    const loadRoadmapData = async () => {
      try {
        const data = await fetchRoadmapStats();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching roadmap:', error);
      }
    };

    loadRoadmapData();
  }, [fetchRoadmapStats]);

  // Обработка клавиши пробел
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
        setIsDragging(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Обработка событий мыши для перемещения канваса
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Средняя кнопка мыши ИЛИ левая кнопка + пробел
      if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
        e.preventDefault();
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
        canvas.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;

        setViewport((prev) => ({
          ...prev,
          offset: {
            x: prev.offset.x + deltaX,
            y: prev.offset.y + deltaY,
          },
        }));

        setLastMousePos({ x: e.clientX, y: e.clientY });
      } else if (isSpacePressed) {
        canvas.style.cursor = 'grab';
      } else {
        canvas.style.cursor = 'default';
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1 || e.button === 0) {
        setIsDragging(false);
        canvas.style.cursor = isSpacePressed ? 'grab' : 'default';
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
      setViewport((prev) => ({
        ...prev,
        scale: Math.max(0.1, Math.min(3, prev.scale * scaleChange)),
      }));
    };

    // Добавляем обработчики на canvas для mousedown и wheel
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('wheel', handleWheel);

    // Добавляем обработчики на window для mousemove и mouseup
    // чтобы отслеживать движение даже когда курсор выходит за пределы канваса
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    canvas.style.cursor = 'default';

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, lastMousePos, isSpacePressed]);

  // Отрисовка канваса
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || categories.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Устанавливаем размер канваса
    const container = containerRef.current;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    // Очищаем канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Применяем трансформации
    ctx.save();
    ctx.translate(viewport.offset.x, viewport.offset.y);
    ctx.scale(viewport.scale, viewport.scale);

    // Отрисовываем роадмап
    drawRoadmap(ctx, categories);

    ctx.restore();
  }, [categories, viewport]);

  const drawRoadmap = (
    ctx: CanvasRenderingContext2D,
    categories: RoadmapCategory[]
  ) => {
    const nodeWidth = 200;
    const nodeHeight = 120;
    const spacing = 100;
    const startX = 50;
    const startY = 50;

    categories.forEach((category, index) => {
      const x = startX + (index % 3) * (nodeWidth + spacing);
      const y = startY + Math.floor(index / 3) * (nodeHeight + spacing * 2);

      // Рисуем основную категорию
      drawCategoryNode(ctx, category, x, y, nodeWidth, nodeHeight);

      // Рисуем подкатегории
      category.subCategories.forEach((subCat, subIndex) => {
        const subX = x + (subIndex % 2) * (nodeWidth / 2 + 20);
        const subY = y + nodeHeight + 40 + Math.floor(subIndex / 2) * 80;
        drawSubCategoryNode(ctx, subCat, subX, subY, nodeWidth / 2, 60);

        // Рисуем связь между категорией и подкатегорией
        drawConnection(
          ctx,
          x + nodeWidth / 2,
          y + nodeHeight,
          subX + nodeWidth / 4,
          subY
        );
      });
    });
  };

  const drawCategoryNode = (
    ctx: CanvasRenderingContext2D,
    category: RoadmapCategory,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const progress = category.overallProgress;

    // Цвет в зависимости от прогресса
    const getProgressColor = (progress: number) => {
      if (progress >= 80) return '#10b981'; // green
      if (progress >= 60) return '#f59e0b'; // yellow
      if (progress >= 40) return '#f97316'; // orange
      return '#ef4444'; // red
    };

    // Рисуем фон узла
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(x, y, width, height);

    // Рисуем прогресс-бар
    ctx.fillStyle = getProgressColor(progress);
    ctx.fillRect(x, y + height - 8, (width * progress) / 100, 8);

    // Рисуем границу
    ctx.strokeStyle = getProgressColor(progress);
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Рисуем текст
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(category.name, x + width / 2, y + 25);

    ctx.font = '12px Arial';
    ctx.fillText(`${progress}%`, x + width / 2, y + 45);

    ctx.font = '10px Arial';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(
      `Контент: ${category.contentStats.completed}/${category.contentStats.total}`,
      x + width / 2,
      y + 65
    );
    ctx.fillText(
      `Теория: ${category.theoryStats.completed}/${category.theoryStats.total}`,
      x + width / 2,
      y + 80
    );
  };

  const drawSubCategoryNode = (
    ctx: CanvasRenderingContext2D,
    subCategory: { name: string; overallProgress: number },
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const progress = subCategory.overallProgress;

    // Цвет в зависимости от прогресса
    const getProgressColor = (progress: number) => {
      if (progress >= 80) return '#10b981';
      if (progress >= 60) return '#f59e0b';
      if (progress >= 40) return '#f97316';
      return '#ef4444';
    };

    // Рисуем фон узла
    ctx.fillStyle = '#374151';
    ctx.fillRect(x, y, width, height);

    // Рисуем прогресс-бар
    ctx.fillStyle = getProgressColor(progress);
    ctx.fillRect(x, y + height - 4, (width * progress) / 100, 4);

    // Рисуем границу
    ctx.strokeStyle = getProgressColor(progress);
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    // Рисуем текст
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(subCategory.name, x + width / 2, y + 25);

    ctx.font = '10px Arial';
    ctx.fillText(`${progress}%`, x + width / 2, y + 40);
  };

  const drawConnection = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
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
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.roadMap}>
      <div className={styles.header}>
        <h1>Роадмап обучения</h1>
        <div className={styles.controls}>
          <p>Перемещение: средняя кнопка мыши или пробел + левая кнопка мыши</p>
          <p>Масштабирование: колесико мыши</p>
        </div>
      </div>

      <div ref={containerRef} className={styles.canvasContainer}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </div>
  );
};

export default RoadMap;

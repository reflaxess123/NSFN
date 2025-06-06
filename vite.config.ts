import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@/shared': '/src/shared',
      '@/app': '/src/app',
      '@/pages': '/src/pages',
      '@/widgets': '/src/widgets',
      '@/features': '/src/features',
      '@/entities': '/src/entities',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React и связанные библиотеки
          if (
            id.includes('react') ||
            id.includes('react-dom') ||
            id.includes('react-router')
          ) {
            return 'react';
          }

          // UI библиотеки
          if (
            id.includes('lucide-react') ||
            id.includes('clsx') ||
            id.includes('framer-motion')
          ) {
            return 'ui';
          }

          // TanStack Query и Redux
          if (
            id.includes('@tanstack/react-query') ||
            id.includes('@reduxjs/toolkit') ||
            id.includes('redux')
          ) {
            return 'state';
          }

          // Админские страницы
          if (id.includes('pages/Admin') || id.includes('pages/Adminka')) {
            return 'admin';
          }

          // Основные страницы
          if (
            id.includes('pages/Profile') ||
            id.includes('pages/Tasks') ||
            id.includes('pages/Theory')
          ) {
            return 'pages';
          }

          // Shared компоненты и хуки
          if (id.includes('shared/components') || id.includes('shared/hooks')) {
            return 'shared';
          }

          // Крупные библиотеки
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // Увеличиваем лимит предупреждения о размере чанков
    chunkSizeWarningLimit: 800,
    // Включаем минификацию
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Убираем console.log в продакшене
        drop_debugger: true,
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

import Adminka from '@/pages/Adminka/ui/Adminka';
import { Chat } from '@/pages/Chat';
import { lazy } from 'react';
import type { AppRoute } from './types';

const Home = lazy(() =>
  import('@/pages/Adminka').then((module) => ({ default: module.Adminka }))
);
const Profile = lazy(() =>
  import('@/pages/Profile').then((module) => ({ default: module.Profile }))
);
const Tasks = lazy(() =>
  import('@/pages/Tasks').then((module) => ({ default: module.Tasks }))
);
const Theory = lazy(() =>
  import('@/pages/Theory').then((module) => ({ default: module.Theory }))
);
const RoadMap = lazy(() =>
  import('@/pages/RoadMap').then((module) => ({ default: module.RoadMap }))
);

export enum AppRoutes {
  HOME = '/',
  TASKS = '/tasks',
  THEORY = '/theory',
  PROFILE = '/profile',
  CHAT = '/chat',
  ADMIN_PANEL = '/admin-panel',
  ROADMAP = '/roadmap',
}

export const routeConfig: AppRoute[] = [
  { path: AppRoutes.HOME, element: <Home /> },
  { path: AppRoutes.TASKS, element: <Tasks /> },
  { path: AppRoutes.THEORY, element: <Theory /> },
  { path: AppRoutes.PROFILE, element: <Profile /> },
  { path: AppRoutes.CHAT, element: <Chat /> },
  { path: AppRoutes.ADMIN_PANEL, element: <Adminka /> },
  { path: AppRoutes.ROADMAP, element: <RoadMap /> },
];

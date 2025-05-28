import { lazy } from 'react';
import type { AppRoute } from './types';

const Home = lazy(() =>
  import('@/pages/Home').then((module) => ({ default: module.Home }))
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

export enum AppRoutes {
  HOME = '/',
  TASKS = '/tasks',
  THEORY = '/theory',
  PROFILE = '/profile',
}

export const routeConfig: AppRoute[] = [
  { path: AppRoutes.HOME, element: <Home /> },
  { path: AppRoutes.TASKS, element: <Tasks /> },
  { path: AppRoutes.THEORY, element: <Theory /> },
  { path: AppRoutes.PROFILE, element: <Profile /> },
];

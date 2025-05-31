import type { RootState } from '@/app/providers/redux/model/store';
import { hasRole, isAdmin, isGuest, isUser, type UserRole } from './types';

export const selectUser = (state: RootState) => state.user.data;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const selectIsInitialized = (state: RootState) =>
  state.user.isInitialized;
export const selectError = (state: RootState) => state.user.error;

// Селекторы для работы с ролями
export const selectUserRole = (state: RootState): UserRole =>
  state.user.data?.role || 'GUEST';

export const selectIsAdmin = (state: RootState): boolean =>
  isAdmin(selectUserRole(state));

export const selectIsUser = (state: RootState): boolean =>
  isUser(selectUserRole(state));

export const selectIsGuest = (state: RootState): boolean =>
  isGuest(selectUserRole(state));

// Фабрика селектора для проверки конкретной роли
export const selectHasRole =
  (requiredRole: UserRole) =>
  (state: RootState): boolean =>
    hasRole(selectUserRole(state), requiredRole);

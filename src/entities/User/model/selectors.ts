import type { RootState } from '@/app/providers/redux/model/store';

export const selectUser = (state: RootState) => state.user.data;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const selectIsInitialized = (state: RootState) =>
  state.user.isInitialized;
export const selectError = (state: RootState) => state.user.error;

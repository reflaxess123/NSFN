import {
  selectError,
  selectIsAuthenticated,
  selectIsInitialized,
  selectIsLoading,
  selectUser,
} from '@/entities/User';
import { useAppSelector } from './redux';

export const useAuth = () => {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitialized = useAppSelector(selectIsInitialized);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return { isAuthenticated, isInitialized, isLoading, user, error };
};

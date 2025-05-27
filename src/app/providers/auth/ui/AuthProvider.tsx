import { checkProfile, selectIsInitialized, selectIsLoading } from '@/entities/User';
import { Loading } from '@/shared/components/Loading';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { useEffect } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(selectIsInitialized);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(checkProfile());
    }
  }, [dispatch, isInitialized]);

  if (!isInitialized || isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
};

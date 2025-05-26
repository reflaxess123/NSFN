import { usePageTransition } from '@/shared/hooks/usePageTransition';
import { Loading } from '../Loading';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const isLoading = usePageTransition();

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
};

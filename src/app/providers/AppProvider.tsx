import { ModalProvider } from '@/shared/components/Modal/model/context';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { AuthProvider } from './auth/ui/AuthProvider';
import { ModalRenderer } from './modal/ui/ModalProvider';
import { store } from './redux';
import { AppRouter } from './router';

interface AppProviderProps {
  children?: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ModalProvider>
          {children || <AppRouter />}
          <ModalRenderer />
        </ModalProvider>
      </AuthProvider>
    </Provider>
  );
};

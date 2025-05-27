import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { AuthProvider } from './providers/auth/ui/AuthProvider.tsx';
import store from './providers/redux/store.ts';
import { AppRouter } from './providers/router/ui/AppRouter.tsx';
import './styles/globals.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Provider>
  </StrictMode>
);

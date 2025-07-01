import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/styles/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FontSizeProvider from './06_providers/font-size-provider.tsx';
import ThemeProvider from './06_providers/theme-provider.tsx';
import App from './App.tsx';
import { Toaster } from './components/ui/sonner.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="bottom-left" expand={true} duration={3000} />
      <ThemeProvider />
      <FontSizeProvider />
    </QueryClientProvider>
  </StrictMode>,
);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {initialize} from './lib/honeycomb.ts';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import App from './App.tsx'

// Add HoneycombWebSDK to observe code and send to collector
initialize();

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)

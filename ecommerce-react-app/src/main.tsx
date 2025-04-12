// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {initialize} from './lib/honeycomb.ts';

import App from './App.tsx'

// Add HoneycombWebSDK to observe code and send to collector
initialize();

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)

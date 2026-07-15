// Make window.fetch writable and configurable to prevent third-party library crashes
try {
  const originalFetch = window.fetch;
  if (originalFetch) {
    Object.defineProperty(window, 'fetch', {
      value: function(...args: any[]) {
        return originalFetch.apply(this, args as any);
      },
      writable: true,
      configurable: true,
      enumerable: true
    });
  }
} catch (e) {
  console.warn('Failed to configure fetch in main.tsx:', e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

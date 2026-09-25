import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {initContentProtection} from './utils/contentProtection.ts';
import './index.css';

// Activate the global content protection before rendering the app.
initContentProtection();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

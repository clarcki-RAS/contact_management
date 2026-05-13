import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppRoutes from './routes'; // Importez le routeur

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoutes /> {/* Utilisez AppRoutes ici */}
  </StrictMode>
);

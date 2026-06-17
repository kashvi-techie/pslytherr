import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Note: StrictMode is removed to prevent double-mounting in development,
// which causes exchangeCodeForSession to be called twice on the same
// OAuth code (which is single-use and fails on the second call).
createRoot(document.getElementById('root')!).render(<App />);

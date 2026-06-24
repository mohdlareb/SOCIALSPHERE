import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';

const storedTheme = window.localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDark = storedTheme ? storedTheme === 'dark' : prefersDark;

const rootElement = document.documentElement;
rootElement.classList.toggle('dark', isDark);
rootElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
rootElement.style.colorScheme = isDark ? 'dark' : 'light';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
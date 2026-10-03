import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LocaleProvider } from './i18n';
import { ThemeProvider } from './hooks/useTheme';
import { ToastProvider } from './hooks/useToast';
import './index.css';

/**
 * When text is selected on the page and copied, put only plain text on the
 * clipboard. Otherwise most apps (Word, mail clients) also receive the page's
 * fonts, colours and sizes and paste text that looks like the website. Copying
 * inside form fields keeps the browser's default behaviour.
 */
document.addEventListener('copy', (e) => {
  const target = e.target as HTMLElement | null;
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
  const text = window.getSelection()?.toString();
  if (!text || !e.clipboardData) return;
  e.clipboardData.setData('text/plain', text);
  e.preventDefault();
});

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found in index.html');
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ThemeProvider>
      <LocaleProvider>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </LocaleProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

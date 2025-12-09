import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';
import { initPerformanceMonitoring } from './utils/performanceMonitoring';
import { initializeTheme, watchSystemTheme } from './utils/themeInit';

// Initialize theme before rendering to prevent FOUC
initializeTheme();

// Watch for system theme changes
watchSystemTheme();

// Initialize performance monitoring in development
initPerformanceMonitoring();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

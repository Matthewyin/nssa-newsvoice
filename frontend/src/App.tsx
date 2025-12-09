import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { AuthProvider } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import AnalyticsTracker from './components/AnalyticsTracker';

/**
 * Application routing configuration
 *
 * 路由结构：
 * - 公共路由：
 *   - "/login"                登录页
 * - 受保护路由（需要登录）：
 *   - "/"                     主页（显示三个板块）
 *   - "/:category"            分类文档列表
 *   - "/:category/:id"        文档详情页
 * - 404 页面：
 *   - "*"                     所有未匹配的路径显示 404 页面
 */

// Lazy load pages for code splitting
const PublicLayout = lazy(() => import('./components/layout/PublicLayout'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const DocumentPage = lazy(() => import('./pages/DocumentPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Initialize Google Analytics
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

function App() {
  return (
    <AuthProvider>
      <AnalyticsTracker />
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
        <Suspense fallback={<LoadingSpinner message="加载页面中..." />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <PublicLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<HomePage />} />
              <Route path="/:category" element={<CategoryPage />} />
              <Route path="/:category/:id" element={<DocumentPage />} />
            </Route>

            {/* 404 Page: show friendly error page for unmatched routes */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;

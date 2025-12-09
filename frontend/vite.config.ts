import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for smaller bundle size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core libraries
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }

          // Firebase libraries
          if (id.includes('node_modules/firebase')) {
            return 'firebase-vendor';
          }

          // React Query
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'query-vendor';
          }

          // Date utilities
          if (id.includes('node_modules/date-fns')) {
            return 'date-vendor';
          }

          // Admin pages - separate chunk for admin functionality
          if (id.includes('/src/pages/admin/')) {
            return 'admin-pages';
          }

          // Common components
          if (id.includes('/src/components/common/')) {
            return 'common-components';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Enable minification for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console methods
      },
      format: {
        comments: false, // Remove comments
      },
    },
    // CSS optimization
    cssCodeSplit: true, // Enable CSS code splitting
    cssMinify: true, // Minify CSS
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': '/src',
    },
  },
}));

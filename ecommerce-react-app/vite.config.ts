import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [tailwindcss(), react()],
    server: {
      proxy: {
        '/api/products': {
          target: env.VITE_COMMERCE_ENDPOINT,
          changeOrigin: true,
          secure: false,
        },
        '/api/orders': {
          target: env.VITE_ORDER_ENDPOINT,
          changeOrigin: true,
          secure: false,
        },
        '/api/cart': {
          target: env.VITE_COMMERCE_ENDPOINT,
          changeOrigin: true,
          secure: false,
        },
        '/api/chat': {
          target: env.VITE_CHAT_ENDPOINT,
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/otlp': {
          target: env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/v1\/traces$/, '')
        }
      }
    }
  }
})

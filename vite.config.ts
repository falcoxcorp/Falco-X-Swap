import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    })
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'framer-motion',
      'react-i18next',
      'i18next'
    ],
    exclude: []
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    port: 5173,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          web3: ['ethers'],
          ui: ['lucide-react', 'framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 2000
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  esbuild: {
    target: 'es2020'
  }
});
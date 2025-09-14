import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import imagemin from 'vite-plugin-imagemin';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    imagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 80
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
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
    exclude: ['@supabase/supabase-js']
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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          web3: ['web3', 'ethers', 'viem'],
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          particles: ['react-tsparticles', 'tsparticles'],
          icons: ['lucide-react']
        }
      }
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
        cssnano({
          preset: ['default', {
            discardComments: {
              removeAll: true,
            },
            minifyFontValues: true,
            minifyGradients: true
          }]
        })
      ]
    },
    devSourcemap: true
  },
  esbuild: {
    target: 'es2020',
    legalComments: 'none',
    treeShaking: true
  }
});
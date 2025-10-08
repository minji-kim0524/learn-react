import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { type ConfigEnv, type ProxyOptions, defineConfig, loadEnv } from 'vite'
import viteCompression from 'vite-plugin-compression'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'

  return {
    plugins: [react(), tailwindcss(), viteCompression()],
    server: {
      port: 3000,
      hmr: !isProduction,
      proxy: !isProduction
        ? {
            '/api': {
              target: env.VITE_API_URL || 'http://localhost:4000',
              rewrite: (path: string) => path.replace(/^\/api/, ''),
              changeOrigin: true,
            } as ProxyOptions,
          }
        : undefined,
    },
    preview: {
      port: 5000,
    },
    css: {
      devSourcemap: !isProduction,
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@assets': path.resolve(__dirname, 'src/assets'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: !isProduction,
      // `as const`를 사용하면 'terser'를 문자열이 아닌,
      // 정확히 'terser' 리터럴 타입으로 TypeScript가 인식
      minify: isProduction ? ('terser' as const) : false,
      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
            format: {
              comments: false,
            },
          }
        : {},
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: isProduction
            ? {
                vendor: ['react', 'react-dom'],
                router: [],
                ui: [],
              }
            : {},
          entryFileNames: 'entries/[name]-[hash].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
      treeshake: true,
      target: 'es2015',
      reportCompressedSize: isProduction,
    },
    envPrefix: 'VITE_',
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  }
})

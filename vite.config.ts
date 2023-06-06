import path from 'path';
import { defineConfig, Plugin, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';
import Unocss from './config/unocss';

const rollupOptions = {
  external: ['vue', 'vue-router'],
  output: {
    globals: {
      vue: 'Vue',
    },
    assetFileNames: `index.[ext]`,
  },
};

export const config = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue() as Plugin,
    vueJsx() as Plugin,
    Unocss() as Plugin[],
    dts({
      outputDir: './dist/types',
      insertTypesEntry: false,
      copyDtsFiles: true,
    }),
  ],
  build: {
    rollupOptions,
    minify: 'terser', // boolean | 'terser' | 'esbuild'
    sourcemap: true,
    brotliSize: true, // 生成压缩大小报告
    cssCodeSplit: true,
    lib: {
      entry: './src/entry.ts',
      name: 'GenesisUI',
      fileName: 'index',
      formats: ['esm', 'umd'],
    },
    outDir: './dist',
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    transformMode: {
      web: [/.[tj]sx$/],
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(config as UserConfig);

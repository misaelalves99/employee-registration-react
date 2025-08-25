// vite.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,                 // Permite usar `describe`, `it`, `expect` globalmente
    environment: 'jsdom',          // Simula ambiente de navegador
    setupFiles: './src/setupTests.ts', // Arquivo de configuração de testes
    coverage: {
      reporter: ['text', 'json', 'html'], // Relatórios de cobertura opcionais
    },
  },
});

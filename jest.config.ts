// jest.config.ts

import type { Config } from 'jest';

const config: Config = {
  // Simula o ambiente de navegador
  testEnvironment: 'jsdom',

  // Arquivo de setup para jest-dom e outros matchers
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // Transformação de arquivos TS/TSX com ts-jest
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  // Extensões de arquivos para módulos
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Mapeamento de CSS Modules para identity-obj-proxy
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Coverage opcional
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'json', 'html'],
};

export default config;

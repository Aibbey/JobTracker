

import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export const commonGlobals = {

  window: 'readonly',
  document: 'readonly',
  console: 'readonly',
  localStorage: 'readonly',
  fetch: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
  Headers: 'readonly',
  Response: 'readonly',
  Request: 'readonly',
  RequestInit: 'readonly',
  MessageEvent: 'readonly',
  KeyboardEvent: 'readonly',
  FileReader: 'readonly',
  FileList: 'readonly',
  File: 'readonly',
  HTMLButtonElement: 'readonly',
  HTMLDivElement: 'readonly',
  HTMLElement: 'readonly',
  Window: 'readonly',
  ImportMeta: 'readonly',
  crypto: 'readonly',
  atob: 'readonly',
  btoa: 'readonly',
  alert: 'readonly',
  confirm: 'readonly',
  prompt: 'readonly',
  WebSocket: 'readonly',
  MozWebSocket: 'readonly',
  Image: 'readonly',
  navigator: 'readonly',
  event: 'readonly',
  Blob: 'readonly',


  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  AbortController: 'readonly',
  process: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',


  React: 'readonly',
  JSX: 'readonly',
  IPython: 'readonly',
};

export const commonIgnores = [
  'dist*.min.js',
  'src/routeTree.gen.ts',
];

export const commonLanguageOptions = {
  ecmaVersion: 2022,
  sourceType: 'module',
  parser: typescriptParser,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: commonGlobals,
};

export default [
  {
    ignores: commonIgnores,
  },
  {
    files: ['***.{js,jsx,ts,tsx}'],
    rules: {
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
    },
  },
  {

    files: ['**/*.d.ts'],
    rules: {
      'no-unused-vars': 'off',
    },
  },
];
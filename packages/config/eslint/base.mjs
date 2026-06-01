import js from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

const baseConfig = [
  {
    ignores: [
      '**/node_modules/**',
      '**/.tools/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/.expo/**',
      '**/.expo-shared/**',
      '**/.wrangler/**',
      '**/.wrangler-home/**',
      '**/.turbo/**',
      '**/.vercel/**',
      '**/coverage/**',
      '**/*.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextVitals.map((config) => ({
    ...config,
    files: ['apps/admin/**/*.{js,mjs,cjs,ts,tsx}'],
  })),
  ...nextTs.map((config) => ({
    ...config,
    files: ['apps/admin/**/*.{js,mjs,cjs,ts,tsx}'],
  })),
  eslintConfigPrettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['apps/admin/**/*.{js,mjs,cjs,ts,tsx}'],
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];

export default baseConfig;

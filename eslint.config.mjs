import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import configPrettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  {
    files: ['src/**/*.ts', 'tests/**/*.ts', 'benchmarks/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off', // Matikan jika terlalu mengganggu saat prototyping
      '@typescript-eslint/no-empty-object-type': 'off', // Ijinkan interface kosong untuk placeholder operator
      '@typescript-eslint/no-unsafe-declaration-merging': 'warn', // Ubah jadi warn saja
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_', // Ijinkan variabel underscore tidak terpakai
        },
      ],
      'no-console': 'off',
    },
  },
  configPrettier,
];

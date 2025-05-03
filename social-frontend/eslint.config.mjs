import { defineConfig } from 'eslint/config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    {
        extends: compat.extends('next'),

        plugins: {
            '@typescript-eslint': typescriptEslint,
            prettier,
        },

        languageOptions: {
            parser: tsParser,
        },

        rules: {
            'prettier/prettier': [
                'warn',
                {
                    tabWidth: 4,
                    printWidth: 100,
                    endOfLine: 'auto',
                    arrowParens: 'avoid',
                    trailingComma: 'all',
                    semi: true,
                    useTabs: false,
                    singleQuote: true,
                    jsxSingleQuote: true,
                    bracketSpacing: true,
                    bracketSameLine: false,
                },
            ],

            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            'prefer-const': 'warn',
            'no-console': 'warn',
        },
    },
]);

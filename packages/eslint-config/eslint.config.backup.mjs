import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    // Ignore deprecated files
    {
        ignores: [
            'src/feature/blog/deprecated/**',
            'src/pages/blog/deprecated/**'
        ]
    },
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    ...compat.config({
        extends: ['next'],
        rules: {
            'react/no-unescaped-entities': 'off',
            '@next/next/no-page-custom-font': 'off',
            'no-unused-vars': 'off',
        },

        // typscript lint override
        overrides: [
            {
                files: ['**/*/*.ts', '**/*.tsx'],
                plugins: [

                    '@typescript-eslint',
                    // '@typescript-eslint/internal',
                    // 'deprecation',
                    'eslint-comments',
                    'eslint-plugin',
                    'import',
                    'jest',
                    'simple-import-sort',
                ],
                parserOptions: {
                    ecmaVersion: 'latest',
                    sourceType: 'module',
                    project: ['./tsconfig.json'], // Specify it only for TypeScript files
                    tsconfigRootDir: process.cwd(),
                },
                rules: {
                    // 'deprecation/deprecation': 'error',

                    'import/extensions': [
                        'warn', // 또는 'warn'으로 설정 가능
                        {
                            js: 'never', // JavaScript 파일에 대해 확장자를 사용하지 않음
                            jsx: 'never', // JSX 파일에 대해 확장자를 사용하지 않음
                            ts: 'never', // TypeScript 파일에 대해 확장자를 사용하지 않음
                            tsx: 'never', // TSX 파일에 대해 확장자를 사용하지 않음
                        },
                    ],
                    'no-console': ['warn', { allow: ['warn', 'error'] }],
                    'no-param-reassign': 'error',

                    // Prevent TypeScript-specific constructs from being erroneously flagged as unused
                    // Note: you must disable the base rule as it can report incorrect errors
                    'no-unused-vars': 'off',
                    '@typescript-eslint/no-unused-vars': [
                        'warn',
                        {
                            vars: 'all', // all | local
                            // varsIgnorePattern: '^_+$',
                            args: 'all', // all | after-used | none
                            argsIgnorePattern: '^_+$',
                        },
                    ],
                    'no-empty-function': 'off',
                    '@typescript-eslint/no-empty-function': 'warn',

                    // '@typescript-eslint/ban-types': 'warn',
                    '@typescript-eslint/restrict-plus-operands': 'warn',
                    '@typescript-eslint/no-empty-interface': 'off',
                    '@typescript-eslint/restrict-template-expressions': 'warn',
                    'react/prop-types': 'off',
                    'react/no-unknown-property': [
                        'error',
                        {
                            ignore: ['global'],
                        },
                    ],

                    // Require PascalCased class and interface names
                    // '@typescript-eslint/class-name-casing'      : 'error',
                    // Require a specific member delimiter style for interfaces and type literals
                    // Default Semicolon style
                    // '@typescript-eslint/member-delimiter-style': 'error',

                    // Require a consistent member declaration order
                    // '@typescript-eslint/member-ordering'        : 'error',
                    // Require consistent spacing around type annotations
                    // '@typescript-eslint/type-annotation-spacing': 'error',

                    eqeqeq: 'error',
                    '@typescript-eslint/restrict-plus-operands': 'warn',
                    '@typescript-eslint/no-empty-interface': 'off',
                    'max-len': ['warn', { code: 200 }],
                    '@typescript-eslint/explicit-function-return-type': 'off',
                    'import/prefer-default-export': 'off',
                    '@typescript-eslint/no-use-before-define': [
                        'error',
                        {
                            functions: false,
                            classes: true,
                            variables: true,
                            typedefs: true,
                        },
                    ],
                    '@typescript-eslint/no-unsafe-assignment': 'off',
                    '@typescript-eslint/no-explicit-any': 'off',
                    '@typescript-eslint/no-unsafe-call': 'off',
                    '@typescript-eslint/no-unsafe-member-access': 'off',
                    '@typescript-eslint/await-thenable': 'off',
                    '@typescript-eslint/no-unsafe-return': 'off',
                    '@typescript-eslint/no-floating-promises': 'off',
                    '@typescript-eslint/no-unsafe-argument': 'off',
                    '@typescript-eslint/require-await': 'off',
                    '@typescript-eslint/ban-ts-comment': 'off',
                    '@typescript-eslint/member-ordering': 'off',
                    '@typescript-eslint/no-misused-promises': [
                        'error',
                        {
                            checksVoidReturn: false,
                        },
                    ],
                    '@typescript-eslint/allowImportingTsExtensions': 'off', // 0: 'off', 1: 'warn', 2: 'error'
                    '@typescript-eslint/no-empty-object-type': [
                        'warn',
                        { allowObjectTypes: 'always' }, // 'never'
                    ],
                },
            },
        ],
    }),
];

export default eslintConfig;

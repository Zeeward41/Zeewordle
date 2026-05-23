import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig(
    // Configuration pour les fichiers JavaScript (sans règles TypeScript)
    {
        files: ['**/*.js'],
        extends: [js.configs.recommended],
        rules: {
            'no-console': ['warn', { allow: ['warn', 'error'] }], // Interdit l'utilisation de console dans le code,
            // sauf console.warn et console.error.
            'prefer-const': 'error', // Oblige à utiliser const quand la variable n'est jamais réassignée.
            'no-var': 'error', // Interdit l'utilisation de var, oblige let ou const.
            eqeqeq: ['error', 'always', { null: 'ignore' }], // Oblige l'utilisation de === au lieu de ==,
            // sauf pour les comparaisons avec null.
        },
    },
    // Configuration pour les fichiers TypeScript
    {
        files: ['**/*.ts'],

        extends: [
            // Choisir UNE des deux options ci-dessous :
            // Option A — Recommandé (type-checking standard)
            //...tseslint.configs.recommendedTypeChecked,
            // Option B — Strict (tolérance zéro, décommenter et commenter Option A)
            ...tseslint.configs.strictTypeChecked,

            ...tseslint.configs.stylisticTypeChecked, // Règles de style et cohérence qui utilisent les types.
        ],
        languageOptions: {
            globals: globals.node,
            parser: tseslint.parser, // remplace le parser par défaut par celui de TypeScript
            // eslint ne sais pas lire les fichiers `.ts` et `.tsx`
            parserOptions: {
                projectService: true, // // trouve et utilise automatiquement le tsconfig.json
                // on indique ou se trouve directement l'emplacement du fichier tsconfig.json
                tsconfigRootDir: import.meta.dirname, // import.meta.dirname = dossier du fichier eslint.config.js
            },
        },
        rules: {
            // règle supplémentaire ()
            '@typescript-eslint/no-explicit-any': 'warn', // Avertit quand tu utilises le type any.

            // ===== Variables inutilisées =====
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    varsIgnorePattern: '^[A-Z_]',
                    argsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],

            // ===== Personnalisations TypeScript =====
            '@typescript-eslint/no-inferrable-types': 'off', // Désactive la règle qui interdit de typer explicitement
            // quand TypeScript peut l'inférer.

            '@typescript-eslint/explicit-module-boundary-types': 'off', // Désactive l'obligation de typer
            // explicitement les fonctions exportées.

            '@typescript-eslint/consistent-type-imports': [
                // Oblige à utiliser import type pour les imports de types TypeScript.
                'error',
                { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
            ],

            '@typescript-eslint/no-misused-promises': [
                // Interdit d'utiliser des Promises dans des contextes non adaptés.
                'error',
                { checksVoidReturn: false },
            ],
        },
    },

    // Les fichiers que le linter ignores.
    {
        ignores: ['node_modules/**', 'dist/**', 'build/**', '*.md'],
    },

    prettierConfig
);

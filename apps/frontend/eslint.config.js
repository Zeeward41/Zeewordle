import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    // 1. Fichiers à ignorer globalement
    {
        ignores: ['dist', 'build', 'node_modules', 'coverage', 'tmpFile_*'],
    },
    // 2. Base commune pour TOUS les fichiers (JS, JSX, TS, TSX)
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooks, // on les met entre '' car il y a un tiret.
            'react-refresh': reactRefresh,
            'jsx-a11y': jsxA11y,
        },
        extends: [
            js.configs.recommended,
            reactPlugin.configs.recommended,
            reactHooks.configs.recommended,
            jsxA11y.configs.recommended,
        ],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.node, // ⚠️ voir la section globals ci-dessous
            },
        },
        settings: {
            // permet de passer des informations partagées à tous les plugins,
            // pour qu'ils puissent fonctionner correctement sans devoir répéter la config dans chaque règle.
            react: {
                version: 'detect', // https://github.com/jsx-eslint/eslint-plugin-react
                // en gros detect la version de réact, ainsi les autres plugins savent quelle version
                // de réact le projet utilise
            },
        },
        rules: {
            // ===== Règles de base JavaScript =====
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'prefer-const': 'error',
            'no-var': 'error',
            eqeqeq: ['error', 'always', { null: 'ignore' }],
            'no-debugger': 'warn',

            // ===== Ajustements React =====
            'react/react-in-jsx-scope': 'off', // Inutile avec React 17+
            'react/prop-types': 'off', // Géré par TypeScript
            'react/jsx-no-target-blank': ['error', { allowReferrer: false }],
            'react/jsx-key': ['error', { checkFragmentShorthand: true }],
            'react/no-array-index-key': 'warn',
            'react/no-danger': 'warn',
            'react/self-closing-comp': [
                'error',
                { component: true, html: true },
            ],

            // ===== Ajustements Accessibilité =====
            'jsx-a11y/click-events-have-key-events': 'warn',
            'jsx-a11y/no-static-element-interactions': 'warn',

            // ===== Fast Refresh (HMR) =====
            'react-refresh/only-export-components': [
                'warn',
                {
                    allowConstantExport: true,
                    allowExportNames: [
                        'meta',
                        'links',
                        'headers',
                        'loader',
                        'action',
                    ],
                },
            ],
        },
    },

    // 3. Couche spécifique TypeScript (s'ajoute par-dessus la base commune)
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser, // remplace le parser par défaut par celui de TypeScript
            // eslint ne sais pas lire les fichiers `.ts` et `.tsx`
            parserOptions: {
                projectService: true, // // trouve et utilise automatiquement le tsconfig.json
                // on indique ou se trouve directement l'emplacement du fichier tsconfig.json
                tsconfigRootDir: import.meta.dirname, // import.meta.dirname = dossier du fichier eslint.config.js
            },
        },
        extends: [
            // Choisir UNE des deux options ci-dessous :
            // Option A — Recommandé (type-checking standard)
            ...tseslint.configs.recommendedTypeChecked,
            // Option B — Strict (tolérance zéro, décommenter et commenter Option A)
            // ...tseslint.configs.strictTypeChecked,

            ...tseslint.configs.stylisticTypeChecked, // Règles de style et cohérence qui utilisent les types.
        ],
        rules: {
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
            '@typescript-eslint/no-explicit-any': 'warn', // Avertit quand tu utilises le type any.

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

    // 4. Ajustement pour les fichiers de configuration (Node.js pur)
    {
        files: ['*.config.{js,ts}'],
        rules: {
            'react-refresh/only-export-components': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/self-closing-comp': 'off',
            'jsx-a11y/click-events-have-key-events': 'off',
            'jsx-a11y/no-static-element-interactions': 'off',
        },
    },

    // 5. Désactivation des règles de formatage en conflit avec Prettier
    prettier,
]);

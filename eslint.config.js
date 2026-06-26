const eslint = require('@eslint/js');
const angular = require('angular-eslint');
const tseslint = require('typescript-eslint');
const sonarLocal = require('./eslint-local-rules');

module.exports = tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**'
    ]
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      'sonar-local': sonarLocal
    },
    rules: {
      '@angular-eslint/no-empty-lifecycle-method': 'off',
      '@angular-eslint/no-output-native': 'off',
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@angular-eslint/prefer-standalone': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-useless-assignment': 'warn',
      'prefer-const': 'warn',
      'sonar-local/array-sort-compare': 'error',
      'sonar-local/cognitive-complexity': ['error', {max: 15}],
      'sonar-local/no-risky-regex': 'error',
      'sonar-local/prefer-modern-dom-before': 'error',
      'sonar-local/prefer-number-static-methods': 'error'
    }
  },
  {
    files: ['scripts/**/*.mjs'],
    plugins: {
      'sonar-local': sonarLocal
    },
    rules: {
      'sonar-local/no-risky-regex': 'error',
      'sonar-local/prefer-number-static-methods': 'error'
    }
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility
    ],
    plugins: {
      'sonar-local': sonarLocal
    },
    rules: {
      '@angular-eslint/template/alt-text': 'warn',
      '@angular-eslint/template/label-has-associated-control': 'warn',
      '@angular-eslint/template/prefer-control-flow': 'off',
      'sonar-local/control-has-associated-label': 'error'
    }
  }
);

module.exports = {
  plugins: ['cypress', 'import'],
  extends: ['./eslint-base', 'plugin:cypress/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    'import/no-extraneous-dependencies': 'error',
    'no-restricted-imports': [
      'error',
      {
        paths: ['admin', 'app', 'common'],
        patterns: ['admin/*', 'app/*', 'common/*'],
      },
    ],
  },
}

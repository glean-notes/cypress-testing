// ESLint config applied to all workspaces
const restrictedSyntaxTests = [
  {
    selector: 'ImportDeclaration[source.value=/\\.spec$/]',
    message: 'Importing from Cypress test files not allowed - doing so causes those tests to run again',
  },
  {
    selector: 'ImportDeclaration[source.value=/\\.test$/]',
    message: 'Importing from test files not allowed - doing so causes those tests to run again',
  },
  {
    selector: 'Literal[value="null"]',
    message: 'Use undefined rather than null',
  },
  {
    selector: 'JSXIdentifier[name=data-test-id]',
    message: 'Please use data-test, instead of data-test-id',
  },
]

const restrictedSyntaxSrc = [
  ...restrictedSyntaxTests,
  {
    selector: 'ImportDeclaration[source.value=/\\.testHelper$/]',
    message: 'Importing from test utility file not allowed for main source code.',
  },
]

module.exports = {
  plugins: ['no-only-tests'],
  extends: ['plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['**/.eslintrc.js', '**/eslint-base.js'],
  rules: {
    '@typescript-eslint/ban-types': [
      // Configure to allow {} for no-props React components per:
      // https://github.com/typescript-eslint/typescript-eslint/issues/2063#issuecomment-675156492
      'error',
      {
        extendDefaults: true,
        types: {
          '{}': false,
        },
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      // Ignore properties that require quotes:
      {
        selector: [
          'classProperty',
          'objectLiteralProperty',
          'typeProperty',
          'classMethod',
          'objectLiteralMethod',
          'typeMethod',
          'accessor',
          'enumMember',
        ],
        format: null,
        modifiers: ['requiresQuotes'],
      },
      {
        selector: 'default',
        format: ['camelCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase'],
      },
      {
        selector: 'variable',
        modifiers: ['const'],
        // We end up needing to be quite permissive here, since we use e.g.
        // UPPER_CASE for actual constants
        // PascalCase for React function components
        // camelCase for functions
        format: ['UPPER_CASE', 'PascalCase', 'camelCase'],
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
      {
        selector: 'variableLike',
        format: ['camelCase'],
      },
      {
        // Allow _ for use as unused parameters
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'require',
        modifiers: ['unused'],
        filter: {
          regex: '^_$',
          match: true,
        },
      },
      {
        // Allow 'Component' to be used for cases where we need to reference a React component as a variable for use in JSX
        selector: 'parameter',
        format: ['PascalCase'],
        filter: {
          regex: '^Component$',
          match: true,
        },
      },
      {
        selector: 'classProperty',
        format: ['camelCase'],
      },
      {
        selector: 'classProperty',
        modifiers: ['static'],
        format: ['camelCase', 'UPPER_CASE'],
      },
      {
        selector: 'objectLiteralProperty',
        format: ['UPPER_CASE', 'PascalCase', 'camelCase'],
      },
      {
        selector: 'typeProperty',
        format: ['camelCase'],
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: false,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/method-signature-style': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-redeclare': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    'brace-style': ['error', '1tbs'],
    curly: ['error', 'all'],
    'import/first': 'off',
    'import/no-anonymous-default-export': 'off',
    'jsx-a11y/role-has-required-aria-props': 'off',
    'jsx-a11y/role-supports-aria-props': 'off',
    'max-classes-per-file': ['error', 1],
    'no-console': 'error',
    'no-nested-ternary': 'error',
    'no-only-tests/no-only-tests': 'error',
    'no-unused-expressions': 'off',
    'object-shorthand': 'error',
    // no-shadow fix per: https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-shadow.md#how-to-use
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'max-depth': ['error', 3],
    'no-restricted-syntax': ['error', ...restrictedSyntaxSrc],
  },
  overrides: [
    {
      files: [
        'src/**/*.test.*',
        'src/**/*.testHelper.*',
        'src/**/*.apiTest.ts',
        'src/setupTests.*',
        'src/**/__mocks__/**/*',
      ],
      rules: {
        'no-restricted-syntax': ['error', ...restrictedSyntaxTests],
      },
    },
  ],
}

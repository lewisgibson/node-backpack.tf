module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'jest', "prettier"],
    env: {
        node: true,
        es6: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:jest/recommended'],
    rules: {
        indent: ['error', 4],
        'quote-props': ['error', 'as-needed'],

        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/camelcase': 'off',
    },
    overrides: [
        {
            files: './tests/**/*',
            env: {
                'jest/globals': true,
            },
        },
    ],
};

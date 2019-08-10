module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'jest', 'prettier'],
    env: {
        node: true,
        es6: true,
    },
    extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'prettier/@typescript-eslint', 'plugin:jest/recommended'],
    rules: {
        'prettier/prettier': 'error',

        //quotes: ['error', 'single'],
        //indent: ['error', 4, { SwitchCase: 1, ignoreComments: true }],
        //semi: ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'quote-props': ['error', 'as-needed'],
        'max-len': ['error', { ignoreComments: true, code: 160 }],

        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/class-name-casing': 'warn',
        '@typescript-eslint/no-namespace': 'off',
    },
    overrides: [
        {
            files: './__tests__/**/*',
            env: {
                'jest/globals': true,
            },
        },
    ],
};

module.exports = {
    extends: ['plugin:prettier/recommended', 'alloy', 'alloy/react', 'alloy/typescript'],
    env: {
        browser: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    globals: {},
    rules: {
        'no-lone-blocks': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
        'no-eq-null': 0,
        eqeqeq: ['error', 'smart'],
        'max-nested-callbacks': ['error', 5],
        '@typescript-eslint/member-ordering': 0,
        'prefer-const': [
            'error',
            {
                destructuring: 'all',
            },
        ],
    },
    ignorePatterns: ['lib.embed.js', 'react-infinite-scroll'],
}

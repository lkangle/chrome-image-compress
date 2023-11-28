/**
 * @type {import('prettier').Options}
 */
export default {
    printWidth: 100,
    semi: false,
    tabWidth: 4,
    singleQuote: true,
    jsxBracketSameLine: true,
    proseWrap: 'preserve',
    quoteProps: 'as-needed',
    endOfLine: 'auto',
    plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
    importOrder: [
        '<BUILTIN_MODULES>', // Node.js built-in modules
        '<THIRD_PARTY_MODULES>', // Imports not matched by other special words or groups.
        '', // Empty line
        '^@plasmo/(.*)$',
        '',
        '^@plasmohq/(.*)$',
        '',
        '^~(.*)$',
        '',
        '^[./]',
    ],
}

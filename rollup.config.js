import typescript from '@rollup/plugin-typescript';

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
    input: {
        'yieldify': './yieldify.ts'
    },
    output: {
        dir: 'dist',
        format: 'esm',
        sourcemap: true
    },
    plugins: [
        typescript({
            emitDeclarationOnly: true
        })
    ]
};
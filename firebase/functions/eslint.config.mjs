import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['lib/**', 'node_modules/**'],
    },
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
            },
        },
    }
);

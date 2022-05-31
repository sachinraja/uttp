module.exports = {
  ignorePatterns: ['/adapters'],
  overrides: [
    {
      files: '*.ts',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        extraFileExtensions: ['.cjs'],
      },
    },
  ],
}

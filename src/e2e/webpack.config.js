module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['node_modules', process.cwd()],
  },
  module: {
    /**
     * Exclude Cypress Axe dependencies from the webpack build since they are already transpiled and transpiling them
     * again causes them to throw exceptions.
     */
    noParse: (content) => /axe-core/.test(content),

    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
}

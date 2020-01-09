const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/multi-select-facet.ts',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader'
            },
            {
              test: /\.ts$/,
              exclude: [ path.resolve(__dirname, "test") ],
              enforce: 'post',
              use: {
                loader: 'istanbul-instrumenter-loader',
                options: { esModules: true }
              }
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'multi-select-facet.spec.js',
        path: path.resolve(__dirname, '../dist'),
    },
};
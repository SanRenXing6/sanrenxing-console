// webpack.config.dev.js
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.common.js');
const path = require('path');

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'source-map', // Generates source maps for debugging
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        hot: true, // Enables hot module replacement
        historyApiFallback: true // Supports React Router
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'] // Uses `style-loader` for hot reloading
            }
        ]
    }
});

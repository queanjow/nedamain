const path = require('path');

module.exports = {
    entry: './src/index.js',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            assets: path.resolve(__dirname, './src/assets/'),
            components: path.resolve(__dirname, './src/components/'),
            layouts: path.resolve(__dirname, './src/layouts/'),
            variables: path.resolve(__dirname, './src/variables/'),
            views: path.resolve(__dirname, './src/views/')
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};

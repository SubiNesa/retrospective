const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: ['babel-polyfill', './src/app.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: ''
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        index: 'index.html',
        port: 9000
    },
    module: {
        rules: [{
                test: /\.css$/,
                include: /node_modules/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.hbs$/,
                use: [{
                    loader: 'handlebars-loader',
                    options: {
                        helperDirs: path.resolve(__dirname, 'src/views/helpers')
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/, /php/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env'],
                        plugins: ['transform-class-properties']
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            title: 'Loading dev...'
        }),
        new webpack.ProvidePlugin({
            // inject ES5 modules as global vars
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Tether: 'tether'
        })
    ]
};
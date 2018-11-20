const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const SYSTEM = require('./common/SYSTEM');
const WebpackHtmlPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const urlPrefix = '/' + SYSTEM.urlVersion.value;
module.exports = function (env) {
    const isPrd = env && env.production;
    const cwd = process.cwd();
    let config = {};
    config.mode = isPrd ? 'production' : 'development';
    config.target = 'web';
    // entry
    config.entry = {};
    let entryNames = [];
    fs.readdirSync(path.join(__dirname, 'assets', 'entry')).forEach(entryFileName => {
        let baseName = path.basename(entryFileName, path.extname(entryFileName));
        entryNames.push(baseName);
        config.entry[baseName] = path.join(cwd, 'assets', 'entry', entryFileName);
    });
    // output
    config.output = {};
    config.output.chunkFilename = 'js/[name].bundle.js';
    if (isPrd) {
        config.output.filename = 'js/[name]-[hash].js';
        config.output.path = path.join(cwd, 'dist', 'production');
        // set public path for CDN
        config.output.publicPath = urlPrefix + '/';
        config.devtool = 'source-map';
    } else {
        config.output.filename = 'js/[name].js';
        config.output.path = path.join(cwd, 'dist', 'development');
        config.output.publicPath = urlPrefix + '/';
        config.devtool = 'eval-source-map';
    }
    // module
    config.module = {};
    config.module.rules = [];
    config.module.rules.push({
        test: /\.tsx?$/,
        loader: 'ts-loader'
    });
    config.module.rules.push({
        test: /\.(sa|sc|c)ss$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
        ]
    });
    config.module.rules.push({
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [{
            loader: 'file-loader',
            options: {
                name: 'assets/[hash].[ext]'
            }
        }, {
            loader: 'image-webpack-loader',
            options: {
                bypassOnDebug: true,
            },
        },
        ],
    });
    // plugins
    config.plugins = [];
    config.plugins.push(new MiniCssExtractPlugin({
        filename: 'css/[name]-[hash].css',
        chunkFilename: 'css/[name].css'
    }));
    entryNames.forEach(entryName => {
        config.plugins.push(new WebpackHtmlPlugin({
            filename: entryName + '.html',
            template: path.join(cwd, 'assets', 'template.html'),
            favicon: path.join(cwd, 'assets', 'favicon.ico'),
            chunks: [entryName]
        }));
    });
    // config.plugins.push(extractText);
    
    if (isPrd) {
        // clean
        config.plugins.push(new CleanWebpackPlugin(path.join(cwd, 'dist', 'development')));
        config.plugins.push(new CleanWebpackPlugin(path.join(cwd, 'dist', 'production')));
        // config
        config.plugins.push(new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }));
        // config.plugins.push(new MinifyPlugin());
    } else {
        // config.plugins.push(new BundleAnalyzerPlugin());
        config.plugins.push(new CleanWebpackPlugin(path.join(cwd, 'dist', 'development')));
    }
    config.plugins.push(new webpack.NamedModulesPlugin());
    // config.plugins.push(new webpack.HotModuleReplacementPlugin());
    // resolve
    config.resolve = {};
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.json', '.scss', '.css'];
    // dev server
    // if(!isPrd){
    //     config.devServer = {};
    //     config.devServer.hot = true;
    //     config.devServer.contentBase = path.join(cwd, 'dist', 'development');
    //     config.devServer.compress = true;
    //     config.devServer.port = 9001;
    //     config.devServer.historyApiFallback = true;
    // }
    // console.log(config);
    return config;
};
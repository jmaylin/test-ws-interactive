var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var NyanProgressPlugin = require('nyan-progress-webpack-plugin');

module.exports = function(options) {
    var entry = {
        entry: [
          './scripts/app.js'
        ],
        vendors: [
        'react',
        'bootstrap',
        'es6-promise',
        'malihu-custom-scrollbar-plugin',
        'jquery-mousewheel',
        'flux',
        'keymirror',
        'object-assign',
        'slug'
      ]
    };
    var loaders = options.hotComponents ? ['react-hot-loader', 'babel-loader'] : ['babel-loader'];

    var alias = {
      'jquery.ui.widget': 'blueimp-file-upload/js/vendor/jquery.ui.widget',
      'jquery.iframe-transport': 'blueimp-file-upload/js/jquery.iframe-transport'
    };
    var aliasLoader = {

    };
    var externals = {
      'jquery': 'jQuery'
    };
    var modulesDirectories = ['web_modules', 'node_modules'];
    var extensions = ['', '.web.js', '.js', '.jsx'];
    var root = path.join(__dirname, 'scripts');
    var publicPath = options.devServer ?
    'http://localhost:'+options.port+'/_assets/' :
    '';
    var output = {
        path: path.join(__dirname, 'build'),
        publicPath: publicPath,
        filename: 'bundle.js' + (options.longTermCaching && !options.prerender ? '?[chunkhash]' : ''),
        chunkFilename: (options.devServer ? '[id].js' : '[name].js') + (options.longTermCaching && !options.prerender ? '?[chunkhash]' : ''),
        sourceMapFilename: 'debugging/[file].map',
        libraryTarget: options.prerender ? 'commonjs2' : undefined,
        pathinfo: options.debug
    };

    var plugins = [
        new CommonsChunkPlugin('vendors', 'vendors.js'),
        new webpack.PrefetchPlugin('react'),
        new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new NyanProgressPlugin()
    ];

    if(options.production) {
        plugins.push(
            /*new webpack.optimize.UglifyJsPlugin({
                output: {
                    comments: false
                }
            }),*/
            new webpack.optimize.DedupePlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                },
                PUBLIC_URL: JSON.stringify('')
            }),
            new webpack.NoErrorsPlugin()
        );
    }
    else {
      plugins.push(
      new webpack.DefinePlugin({
            })
      );
    }

    return {
        entry: entry,
        output: output,
        target: 'web',
        module: {
            loaders: [
              { test: /\.js$/, loaders: loaders, exclude: /node_modules/ },
              {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                  presets:['es2015', 'react']
                }
              },
              {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
              }
            ]
        },
        devtool: options.devtool,
        debug: options.debug,
        resolveLoader: {
            root: path.join(__dirname, 'node_modules'),
            alias: aliasLoader
        },
        externals: externals,
        resolve: {
            root: root,
            modulesDirectories: modulesDirectories,
            extensions: extensions,
            alias: alias
        },
        devServer: {
            port: options.port
         },
        plugins: plugins
    };
};

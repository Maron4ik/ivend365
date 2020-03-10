const fs = require('fs')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const RemovePlugin = require('remove-files-webpack-plugin')

module.exports = {
  entry: {
    'index': './src/js/index.js',
   
    
    styles: './src/css/_style.css'
  },

  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'compiled'),
  },



  plugins: [
    // Generating HTML

    new HtmlWebpackPlugin({ template: 'src/pug/index.pug', filename: 'index.html', inject: false }),
    new HtmlWebpackPlugin({ template: 'src/pug/main.pug', filename: 'main.html', inject: false }),

    // Generating CSS
    new MiniCssExtractPlugin({ filename: 'style.css' }),

    // Clean project before build
    new CleanWebpackPlugin(),

    // Copy images and JS libs
    new CopyWebpackPlugin([
      { from: 'src/img', to: 'img' },
      { from: 'src/js/_libs', to: 'js' }
    ]),

    // Remove unnecessary styles.js generated from CSS file
    new RemovePlugin({
      after: {
        include: [ 'compiled/js/styles.js' ]
      }
    })
  ],
// optimization: {
//   splitChunks: {
//     chunks: 'all'
//   }
// },


  module: {
    rules: [
      // HTML
      {
        test: /\.pug$/,
        use: ['pug-loader']
      },

      // CSS
      {
        test: /\.css$/,
        use: [
          // Extract to external CSS file
          { loader: MiniCssExtractPlugin.loader },

          // Regular CSS
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              sourceMap: true,
              url: false
            }
          },

          // PostCSS with plugins
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-nested'),
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                })
              ],
              sourceMap: true
            }
          }
        ]
      }
    ]
  },



  devServer: {
    contentBase: path.join(__dirname, 'compiled'),
    compress: true,
    writeToDisk: true,
    port: 9000
  },

  mode: 'development'
}

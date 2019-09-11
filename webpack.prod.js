const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const ImageminMozjpeg = require('imagemin-mozjpeg')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const optimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode:"production",
  entry:{
    main:'./src/scripts/script.js',
    vendor:'./src/scripts/vendor.js'
  },
  output: {
    path:path.join(__dirname,'/public/dist/'),
    filename:'[name].[contentHash].bundle.js'
  },
  // optimization:{
  //   minimizer:[
  //     new optimizeCssAssetsPlugin(),
  //     new TerserPlugin()
  //   ]
  // },
  module:{
    rules:[
      {
        test: /\.(png|jpe?g|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              // outputPath: './images/',
              name:"../images/[name].[hash].[ext]"
            }
          }
        ]
      },
      // {
      //   test:/\.html$/,
      //   use:'html-loader'
      // },
      {
        test:/\.scss$/,
        use:[
           MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins:[
      new HtmlWebpackPlugin({
        template:'./views/layouts/main.handlebars',
        inject:'body'
      }),
      new ImageminPlugin({
        pngquant: ({quality: [0.5, 0.5]}),
        plugins: [ImageminMozjpeg({quality: 50})]
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
                '**/*',
                path.join(process.cwd(), 'public/css/*')
            ]
      }),
      new MiniCssExtractPlugin({
        filename:'../css/[name].[contentHash].css'
      })
  ]
}

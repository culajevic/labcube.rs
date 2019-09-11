const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // devServer: {
  //   port: 1606
  // },
  mode:"development",
  entry:{
    main:'./src/scripts/script.js',
    vendor:'./src/scripts/vendor.js'
  },
  output: {
    path:path.join(__dirname,'/public/dist'),
    filename:'[name].bundle.js'
  },
  devtool:'source-map',
  module:{
    rules:[
      {
        test: /\.(png|jpe?g|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name:"../images/[name].[ext]"
            }
          }
        ]
      },
      {
        test:/\.hbs$/,
        use:'handlebars-loader'
      },
      {
        test:/\.scss$/,
        use:[
           MiniCssExtractPlugin.loader,
           {
             loader:'css-loader',
             options:{sourceMap:true}
           },
          {
            loader:'sass-loader',
            options:{sourceMap:true}
          }
        ]
      },
      {
        test:/\.js$/,
        exclude:/node_modules/,
        use:[
          {
            loader:'babel-loader',
            options:{
              presets:['@babel/env'],
              plugins:['transform-class-properties']
            }
          }
        ]
      }
    ]
  },
  plugins:[
    new MiniCssExtractPlugin({
      filename:'../css/[name].css'
    })
  ]
}

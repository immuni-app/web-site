const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "eval-cheap-module-source-map",
  entry:{ "main":["babel-polyfill", "./src/index.js"], "chart":["./src/scripts/chart.js"]},
  devServer: {
    port: 8080,
    contentBase: path.join(__dirname, "dist"),
  },
  node: {
    fs: "empty",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["env"],
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            // creates style nodes from JS strings
            loader: "style-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            // translates CSS into CommonJS
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            // compiles Sass to CSS
            loader: "sass-loader",
            options: {
              outputStyle: "expanded",
              sourceMap: true,
              sourceMapContents: true,
            },
          },
          // Please note we are not running postcss here
        ],
      },
      {
        // Load all images as base64 encoding if they are smaller than 8192 bytes
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // On development we want to see where the file is coming from, hence we preserve the [path]
              name: "[path][name].[ext]?hash=[hash:20]",
              limit: 8192,
            },
          },
        ],
      },
      {
        // Load all icons
        test: /\.(eot|woff|woff2|svg|ttf|otf)([\?]?.*)$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      // Load downloadable files
      {
        test: /\.(pdf|zip)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      // Inject the js bundle at the end of the body of the given template
      inject: true,
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: "faq.html",
      template: "src/pages/faq.html",
      inject: true,
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: "press.html",
      template: "src/pages/press.html",
      inject: true,
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: "dashboard.html",
      template: "src/pages/dashboard.html",
      inject: true,
      chunks: ['main', 'chart']
    }),
    new HtmlWebpackPlugin({
      filename: "download.html",
      template: "src/pages/download.html",
      inject: true,
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: "device-support.html",
      template: "src/pages/device-support.html",
      inject: true,
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: "tou.html",
      template: "src/pages/tou.html",
      inject: true,
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: "pn.html",
      template: "src/pages/pn.html",
      inject: true,
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: "app-pn.html",
      template: "src/pages/app-pn.html",
      inject: true,
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: "app-tou.html",
      template: "src/pages/app-tou.html",
      inject: true,
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: "cs-pn-si.html",
      template: "src/pages/cs-pn-si.html",
      inject: true,
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: "report.html",
      template: "src/pages/report.html",
      inject: true,
      chunks: ['main']

    }),
  ],
};

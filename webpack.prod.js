const path = require("path");

const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin"); //installed via npm
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const buildPath = path.resolve(__dirname, "dist");

module.exports = {
  devtool: "source-map",
  entry:{ "main":["babel-polyfill", "./src/index.js"], "chart":["./src/scripts/chart.js"]},
  output: {
    filename: "[name].[hash:20].js",
    path: buildPath,
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
        test: /\.(scss|css|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            // translates CSS into CommonJS
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            // Runs compiled CSS through postcss for vendor prefixing
            loader: "postcss-loader",
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
        ],
      },
      {
        // Load all images as base64 encoding if they are smaller than 8192 bytes
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name].[hash:20].[ext]",
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
      filename: "report.html",
      template: "src/pages/report.html",
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
      filename: "cs-pn.html",
      template: "src/pages/cs-pn.html",
      inject: true,
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: "cs-pn-si.html",
      template: "src/pages/cs-pn-si.html",
      inject: true,
      chunks: ['main']
    }),
    new CleanWebpackPlugin(buildPath),
    new FaviconsWebpackPlugin({
      // Your source logo
      logo: "./src/assets/icon.png",
      // The prefix for all image files (might be a folder or a name)
      prefix: "icons-[hash]/",
      // Generate a cache file with control hashes and
      // don't rebuild the favicons until those hashes change
      persistentCache: true,
      // Inject the html into the html-webpack-plugin
      inject: true,
      // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
      background: "#fff",
      // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
      title: "Immuni",

      // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "styles.[contenthash].css",
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require("cssnano"),
      cssProcessorOptions: {
        map: {
          inline: false,
        },
        discardComments: {
          removeAll: true,
        },
        discardUnused: false,
      },
      canPrint: true,
    }),
  ],
};

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devServer: {
    watchFiles: ["./**.html", "./src/**/*", "./dist/**/*"],
    liveReload: true,
    /* serve the root dir */
    static: {
      directory: path.join(__dirname, "./"),
    },
    compress: true,
    port: 9000,
    hot: true, // Enable hot module replacement
  },
  entry: "./src/script.ts",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.min.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: "article.html",
      template: "article.html",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "articles.html",
      template: "articles.html",
    }),
    new HtmlWebpackPlugin({
      filename: "contact.html",
      template: "contact.html",
    }),
  ],
};

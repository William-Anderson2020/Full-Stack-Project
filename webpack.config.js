const path = require("path");
module.exports = {
  entry: {
    board: "./src/bundles/board.js",
    serverIndex: "./src/bundles/serverIndex.js",
    store: "./src/bundles/store.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "public/js")
  },
  devServer: {
    contentBase: "./dist"
  },
  watchOptions: {
    ignored: ["node_modules"]
  },
  watch: true
};
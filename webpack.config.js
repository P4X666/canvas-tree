const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  alias: {
    '@': path.resolve(__dirname, 'src')
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "babel-loader",
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, "src"),
    compress: true,
    port: 9000,
    host: "0.0.0.0",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};

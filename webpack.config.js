module.exports = {
  entry: './src/js/app.js',
  output: {
      path: __dirname+'/dist',
      filename: 'bundle.js'
  },
  module: {
      rules: [
          {
             test: /\.css$/,
              use: [
                  { loader: "style-loader" },
                  { loader: "css-loader" }
              ]
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ['es2015']
              }
            }
          }
      ]
  }
}
 
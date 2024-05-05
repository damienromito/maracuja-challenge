const { override, babelInclude, useBabelRc, addWebpackModuleRule } = require("customize-cra")
const rewireReactHotLoader = require("react-app-rewire-hot-loader")
const rewireTypescript = require("react-app-rewire-typescript")

const path = require("path")

module.exports = function (config, env) {
  config = rewireReactHotLoader(config, env)

  return Object.assign(
    config,
    override(
      addWebpackModuleRule({
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: "file-loader",
      }),
      addWebpackModuleRule({
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      }),
      addWebpackModuleRule({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        use: "file-loader",
      }),
      addWebpackModuleRule({
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [{ loader: "url-loader" }],
      }),
      useBabelRc(),
      babelInclude([
        /* transpile (converting to es5) code in src/ and shared component library */
        path.resolve("src"),
        path.resolve("../shared"),
      ])
    )(config, env)
  )
}

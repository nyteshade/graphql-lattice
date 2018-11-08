module.exports = {
  "presets": [
    "@babel/preset-flow",
    "@babel/preset-env"
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime", {
      "corejs": false,
      "helpers": true,
      "regenerator": true,
      "useESModules": false 
    }],
    "@babel/plugin-transform-flow-strip-types",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "spec": true }]
  ],
  "sourceMaps": "inline"
}

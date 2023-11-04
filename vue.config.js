const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack:{
    // resolve: {
    //   fallback: {
    //     "path": require.resolve('path-browserify'),
    //   },
    // },
    // node: {
    //   // provides the global variable named "global"
    //   //global: true,
      
    //   // provide __filename and __dirname global variables
    //   //__filename: true,
    //   //__dirname: true,
    // },
    plugins:[
      new NodePolyfillPlugin()
    ]
  },

  devServer:{
    port:7700,
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		},
    
    electronBuilder:{
      builderOptions:{
        "productName": "ST Exam client",
        "appId": "st-exam-client",
        "win" : {
          "target": [
            "nsis"
          ],
          "icon" : "./public/icons/icon-stec.ico"
        },
        "nsis":{
          "oneClick": false,
          "installerIcon": "./public/icons/icon-stec.ico",
          "uninstallerIcon": "./public/icons/icon-stec.ico",
          "license": "license.md",
          "allowToChangeInstallationDirectory": true,
          "multiLanguageInstaller": true,
          "runAfterFinish": true,
          "unicode": true
        },
        "mac" : {
          "icon" : "./public/icons/icon-stec.ico"
        }
      },
      nodeIntegration: true
    }
  }
})

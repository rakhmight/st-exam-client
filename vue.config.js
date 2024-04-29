const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack:{
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
      "publish": [
        {
          "provider": "generic",
          "url": "http://172.16.18.223:5700/st-exam-client/"
        }
      ],
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

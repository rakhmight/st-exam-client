const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

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
          "runAfterFinish": false,
          "unicode": true
        },
        "mac" : {
          "icon" : "./public/icons/icon-stec.ico"
        }
      }
    }
  }
})

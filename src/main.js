import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

loadFonts()

createApp(App)
  .use(vuetify, {
    iconfont: 'md'
  })
  .use(store)
  .use(router)
  .mount('#app')

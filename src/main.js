import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import "core-js";

loadFonts()

createApp(App)
  .use(vuetify)
  .use(store)
  .use(router)
  .mount('#app')
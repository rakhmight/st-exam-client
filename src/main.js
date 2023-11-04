import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import "core-js";

loadFonts()

const app = createApp(App)
app.use(vuetify)
app.use(store)
app.use(router)

// Global error handler
app.config.errorHandler = (err, instance, info) => {

  // Handle the error globally
  console.error("=============================");
  console.error("Global error:", err);
  console.log("Vue instance:", instance);
  console.log("Error info:", info);
  console.error("=============================");

  localStorage.setItem(`error-${Date.now()}`, JSON.stringify({ error: err.message, info, instance}))

  // Add code for UI notifications, reporting or other error handling logic
  // alert(err + '\n' + info)
  store._mutations.setException[0]({ status: true, error: err, info })
};

app.mount('#app')
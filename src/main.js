import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import path from 'path-browserify'
import "core-js";
import log from 'electron-log/main';

loadFonts()

const app = createApp(App)
app.use(vuetify)
app.use(store)
app.use(router)

log.initialize();

// Global error handler
app.config.errorHandler = (err, instance, info) => {

  const workerInst = new Worker(path.join(process.env.BASE_URL, 'workers', 'actionsSaveWorker.js'));

  // Handle the error globally
  console.error("=============================");
  console.error("Global error:", err);
  console.log("Vue instance:", instance);
  console.log("Error info:", info);
  console.error("=============================");

  workerInst.postMessage(JSON.parse(JSON.stringify(
    {
        type: 'addError',
        ctx: {
            id: Date.now(),
            errorMsg: err.message,
            date: new Date()
        }
    }
)))

  // Add code for UI notifications, reporting or other error handling logic
  // alert(err + '\n' + info)
  store._mutations.setException[0]({ status: true, error: err, info })
};

app.mount('#app')
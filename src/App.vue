<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { initDB } from "./services/localDB"
import { mapMutations, mapGetters } from "vuex"
import path from 'path-browserify'
import makeReq from "./utils/makeReq";

export default {
  name: "App",
  data() {
    return {
      savingsCheckerWorker: undefined,
    };
  },
  methods: {
    ...mapMutations(["setSavesCounter"]),
  },
  computed: mapGetters(['getInitializationProcess', 'getAdminServerIP']),
  async mounted() {
    // Local DB init
    initDB();

    // Local saves id counter
    const savesCounter = localStorage.getItem("savesCounter");
    if (savesCounter) {
      let counter = JSON.parse(savesCounter);
      this.setSavesCounter(counter);
    } else {
      localStorage.setItem("savesCounter", 1);
      this.setSavesCounter(1);
    }

    
    const adminServerIp = localStorage.getItem('st-admin-server')
    // Checking for local saves
    if(adminServerIp){
      if (window.Worker) {
        this.savingsCheckerWorker = new Worker(path.join(process.env.BASE_URL, 'workers', 'actionsSaveWorker.js'))

        this.savingsCheckerWorker.onmessage = async (event) => {
          const workerData = event.data

          if(workerData.type=='savingsCheckingcomplate'){
            
            if(workerData.savings.length){
              console.log(`[Local DB] Found ${workerData.savings.length} local saves`);

              console.log('Savings:', workerData.savings);

              await makeReq(`${adminServerIp}/api/exams/acceptsavings`, 'POST', {
                savings: workerData.savings
              })
              .then(data=>{
                console.log(data)
              })
              .catch(error=>{
                console.error(error)
              })

            } else {
              console.log(`[Local DB] No local saves found`);
            }

            if(this.savingsCheckerWorker){
              this.savingsCheckerWorker.terminate()
              console.log('[Local DB] Savings checking complate');
            }
          }
        }

        
        this.savingsCheckerWorker.postMessage(JSON.parse(JSON.stringify(
          {
              type: 'checkingSavings'
          }
        )))
      }
    }
  },
  unmounted() {
    const adminServerIp = localStorage.getItem('st-admin-server')
    // удаление worker
    if(adminServerIp){
      if(this.savingsCheckerWorker){
          this.savingsCheckerWorker.terminate()
      }
    }
  },
};
</script>

<style>
html {
  overflow-y: auto;
}

.v-main {
  background-color: var(--bg-color);
}

::-webkit-scrollbar {
  width: 12px;
  background-color: #b9b9b9;
  display: none;
}

::-webkit-scrollbar-thumb {
  background-color: #1b6eec9a;
  border-radius: 1em;
}

:root {
  --main-color: #0d5fd8;
  --special-color: #0c2242;
  --bg-color: #d9e3e3;
  --red-color: #d53b12;
}

* {
  overflow-y: auto;
}
</style>

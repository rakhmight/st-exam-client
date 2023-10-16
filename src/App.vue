<template>
  <v-app>
    <v-main>
      <div style="position: relative;">
        <router-view />      
        <div style="position: absolute; bottom: 0; left: 0; z-index: 777; padding: 2px 20px">
          <v-menu
          offset-y
          max-width="120"
          center
          >
              <template v-slot:activator="{ props }">
              <v-btn
                  icon
                  v-bind="props"
                  color="var(--main-color)"
                  density="comfortable"
              >
                  <v-icon
                  size="18"
                  color="white"
                  >mdi-translate</v-icon>
              </v-btn>
              </template>
              
              <v-list style="padding:0">
                <v-list-item
                  v-for="(lang, i) in langs"
                  :key="i"
                  :value="index"
                  @click="setLanguage(lang.short)"
                  density="compact"
                >
                  <v-list-item-title><span style="color: #0167FF">{{lang.lang}}</span></v-list-item-title>
                </v-list-item>
              </v-list>
          </v-menu>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { initDB } from "./services/localDB"
import { mapMutations, mapGetters } from "vuex"
import path from 'path-browserify'
import makeReq from "./utils/makeReq";
import { socket } from '@/socket';

export default {
  name: "App",
  data() {
    return {
      savingsCheckerWorker: undefined,
      langs: [
        {lang: 'русский', short: 'ru'},
        {lang: "o'zbek", short: 'uz_l'}
      ],
      activeLang: 'ru'
    };
  },
  methods: {
    ...mapMutations(["setSavesCounter", 'changeLang', 'setUsersList']),

    setLanguage(lang){
        this.changeLang(lang)
        this.activeLang = lang
      }
  },
  computed: mapGetters(['getInitializationProcess', 'getAdminServerIP', 'getUsersList']),
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

    const ctx = this
    socket.on('usersParams', (usersParamsList)=>{
      const usersParams = []
        usersParamsList.map(up => {
            usersParams.push(...up.usersParams)
        })

        ctx.setUsersList(usersParams)
        console.log(ctx.getUsersList)
    })
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

.lim-txt{
  cursor: help;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

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

          <v-dialog
          v-if="getException.status"
          v-model="getException.status"
          activator="parent"
          width="auto"
        >
          <div class="error-card">
            <div class="error-card__header d-flex flex-row align-center" style="gap:15px">
              <div style="width: 50px;">
                  <v-img src="@/assets/media/global-error.png"></v-img>
              </div>
              <div class="mt-1">
                <span style="font-size: 1.4em; font-weight: 500; color: var(--special-color)">Error detected!</span>
              </div>
            </div>

            <v-divider class="mt-3 mb-7"></v-divider>

            <div class="error-card__content">
              
              <div class="d-flex align-center flex-row" style="gap: 5px">                
                <v-icon size="22" color="var(--red-color)">mdi-alert</v-icon>
                <p style="color: var(--red-color); font-weight: 600;">{{ getException.error }}</p>
              </div>

              <div class="d-flex align-center flex-row" style="gap: 5px">                
                <v-icon size="18" color="#777">mdi-information</v-icon>
                <p>Info: {{ getException.info }}</p>
              </div>
            </div>

            <v-divider class="mt-3 mb-7"></v-divider>

            <div class="w-100 d-flex justify-center mt-3">
                <v-btn
                  density="compact"
                  width="200px"
                  color="#d8a80d"
                  class="d-flex align-center"
                  @click="reloadApp()"
                  >
                    <v-icon size="17" color="#fff">mdi-exit-to-app</v-icon>
                    <span style="color: #fff" class="ml-1">Reload</span>
                </v-btn>
              </div>
          </div>
        </v-dialog>
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

    reloadApp(){
      window.location.reload();
    },

    setLanguage(lang){
        this.changeLang(lang)
        this.activeLang = lang
      }
  },
  computed: mapGetters(['getInitializationProcess', 'getAdminServerIP', 'getUsersList', 'getException']),
  // watch: {
  //   'getException.status'(){
  //     if(this.getException.status) {
  //       console.log('EROOR');
  //     } else {
  //       'OK'
  //     }
  //   }
  // },
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



.error-card{
  padding: 20px;
  width: 800px;
  background-color: #fff;
  border-radius: 5px;
}

.error-card__header {
  position: relative;
}
.error-card__content{
  max-height: 500px;
  overflow-y: auto;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>

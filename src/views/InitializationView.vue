<template>
    <div class="wrapper d-flex align-center justify-center" style="position: relative;">

        <!-- Process bar -->
        <div style="position: relative; padding: 100px;">
            <div
            style="gap: 20px;"
            class="d-flex flex-column justify-center align-center"
            v-if="step=='initialization'"
            >

                <spinner-component/>

                <div style="height: 40px; position: absolute; bottom:40px;" class="d-flex flex-column justify-center">
                    <div v-if="initStep=='checkParams'" style>
                        <v-icon size="18" color="var(--main-color)">mdi-lightning-bolt</v-icon>
                        <span class="ml-1">Проверка зависимостей{{ dotes.ctx }}</span>
                    </div>
                    <div v-if="initStep=='handShakeWithServers'" style>
                        <v-icon size="18" color="var(--main-color)">mdi-server-network</v-icon>
                        <span class="ml-1">Подключение к серверам{{ dotes.ctx }}</span>
                    </div>
                    <div v-if="initStep=='checkSocket'" style>
                        <v-icon size="18" color="var(--main-color)">mdi-link-variant</v-icon>
                        <span class="ml-1">Проверка сокета клиента{{ dotes.ctx }}</span>
                    </div>
                    <div v-if="initStep=='success'" style>
                        <v-icon size="18" color="var(--main-color)">mdi-check</v-icon>
                        <span class="ml-1">Запуск клиента</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Server IP -->
        <div class="w-100 h-100 d-flex align-center justify-center" v-if="step=='servers-hand-shake'">
            <server-ip-form :changeStep="changeStep" />
        </div>
        
        <!-- Bind -->
        <div class="w-100 h-100 d-flex align-center justify-center" v-if="step=='binding'">
            <bind-form/>
        </div>

        <div style="position: absolute; bottom:0; left:0; width: 100%">
            <v-alert
            v-if="problems.value"
            color="warning"
            density="compact"
            >
            <div class="d-flex flex-row align-center justify-space-between" style="gap:20px" v-if="problems.type=='servers' || problems.type=='socket-check'">
                <div class="d-flex">
                    <v-icon size="19" class="mt-1">mdi-alert</v-icon>
                    <span class="ml-2">{{ problems.msg }}</span>
                </div>
                <div>
                    <v-btn
                    density="compact"
                    @click="changeStep('servers-hand-shake')"
                    width="250px"
                    >
                        <span style="color: #000">Сменить IP-адреса</span>
                    </v-btn>
                </div>
            </div>
            </v-alert>
        </div>

    </div>
</template>

<script>
import ServerIpForm from '@/components/init/ServerIpForm'
import BindForm from '@/components/init/BindForm'
import { mapMutations, mapGetters } from 'vuex'
import makeReq from '@/utils/makeReq'
import SpinnerComponent from '@/components/SpinnerComponent'

export default {
    data(){
        return {
            step: undefined,
            initStep: 'checkParams', // handShakeWithServers, checkSocket
            dotes: {
                counter: 0,
                ctx: ''
            },
            dotesInterval: undefined,
            problems: {
                value: false,
                msg: undefined,
                type: undefined
            },

            adminServerInterval: undefined,
            examServerInterval: undefined,
            authServerInterval: undefined,
            sockedCheckInterval: undefined,
            blockIntervals: false
        }
    },
    computed: mapGetters(['getAdminServerIP', 'getExamServerIP', 'getAuthServerIP', 'getSocketCode', 'getDeviceID', 'getUserData']),
    methods:{
        ...mapMutations(['setAdminServerIP', 'setExamServerIP', 'setAuthServerIP', 'setSocketCode', 'setDeviceID', 'setInitializationProcess', 'setAuthState', 'setUsersList', 'setDepartments', 'setSubjects']),

        changeStep(step){
            this.blockIntervals = true
            this.problems.value = false
            clearInterval(this.dotesInterval)
            this.dotesInterval = undefined
            clearInterval(this.adminServerInterval)
            this.adminServerInterval = undefined
            clearInterval(this.examServerInterval)
            this.examServerInterval = undefined
            clearInterval(this.authServerInterval)
            this.authServerInterval = undefined
            clearInterval(this.sockedCheckInterval)
            this.sockedCheckInterval = undefined
            this.step = step
        },

        async handShakeWithAdminServer(){
            console.log('Hand shake with ST-Admin');
            await makeReq(`${this.getAdminServerIP}/api/ping`, 'GET')
            .then((data)=>{
                if(data.statusCode == 200){
                    if(this.adminServerInterval){
                        clearInterval(this.adminServerInterval)
                        this.adminServerInterval = undefined
                        this.problems.value = false
                    }

                    if(data.data.server!='st-admin-server'){
                        this.setAdminServerIP(undefined)
                        localStorage.removeItem('st-admin-server')
                        this.step = 'servers-hand-shake'
                    } else {
                        console.log('[ST-Admin] Ok.');
                        this.handShakeWithExamServer()
                    }
                }
            })
            .catch((error)=>{
                console.error('Error when shaking hands with the management server:', error)
                this.problems.value = true
                this.problems.type = 'servers'
                this.problems.msg = 'Не удаётся подключиться к управляющему серверу. Как только подключение будет восстановлено, программа запуститься. Так же вы можете сменить IP-адреса серверов'

                if(!this.adminServerInterval && !this.blockIntervals){
                    this.adminServerInterval = setInterval(()=>{
                        this.handShakeWithAdminServer()
                    },5000)
                }
            })
        },

        async handShakeWithExamServer(){
            console.log('Hand shake with ST-Exam');
            await makeReq(`${this.getExamServerIP}/api/ping`, 'GET')
            .then((data)=>{
                if(data.statusCode == 200){
                    if(this.examServerInterval){
                        clearInterval(this.examServerInterval)
                        this.examServerInterval = undefined
                        this.problems.value = false
                    }

                    if(data.data.server!='st-exam-server'){
                        this.setExamServerIP(undefined)
                        localStorage.removeItem('st-exam-server')
                        this.step = 'servers-hand-shake'
                    } else {
                        console.log('[ST-Exam] Ok.');
                        this.handShakeWithAuthServer()
                    }
                }
            })
            .catch((error)=>{
                console.error('Error when shaking hands with the exam server:', error)
                this.problems.value = true
                this.problems.type = 'servers'
                this.problems.msg = 'Не удаётся подключиться к раздающему серверу. Как только подключение будет восстановлено, программа запуститься. Так же вы можете сменить IP-адреса серверов'

                if(!this.examServerInterval && !this.blockIntervals){
                    this.examServerInterval = setInterval(()=>{
                        this.handShakeWithExamServer()
                    },5000)
                }
            })
        },

        async handShakeWithAuthServer(){
            console.log('Hand shake with ST-Auth');
            await makeReq(`${this.getAuthServerIP}/api/ping`, 'GET')
            .then(async (data)=>{
                if(data.statusCode == 200){
                    if(this.authServerInterval){
                        clearInterval(this.authServerInterval)
                        this.authServerInterval = undefined
                        this.problems.value = false
                    }

                    console.log(data)
                    if(data.data.server!='st-auth-server'){
                        this.setAuthServerIP(undefined)
                        localStorage.removeItem('st-auth-server')
                        this.step = 'servers-hand-shake'
                    } else {
                        console.log('[ST-Auth] Ok.');

                        setTimeout(()=>{
                            this.initStep = 'checkSocket'

                            this.checkSocket()
                            this.getData()
                        },2000)

                        // Проверка актуальности данных пользователя (если есть)
                        if(this.getUserData){
                            await makeReq(`${this.getAuthServerIP}/api/users/check`, 'POST', {
                                data: {
                                    id: this.getUserData.id,
                                    token: this.getUserData.token.key
                                }
                            })
                            .then((data)=>{
                                if(data.status == 404){
                                    this.setUserData(undefined)
                                    localStorage.removeItem('userData')
                                } else if(data.status == 200){
                                    this.setAuthState(true)
                                }
                            })
                        }
                    }
                }
            })
            .catch((error)=>{
                console.error('Error when shaking hands with the auth server:', error)
                this.problems.value = true
                this.problems.type = 'servers'
                this.problems.msg = 'Не удаётся подключиться к серверу аутентификации. Как только подключение будет восстановлено, программа запуститься. Так же вы можете сменить IP-адреса серверов'

                if(!this.authServerInterval && !this.blockIntervals){
                    this.authServerInterval = setInterval(()=>{
                        this.handShakeWithAuthServer()
                    },5000)
                }
            })
        },

        async checkSocket(){
            console.log('Check device for sockect connection');
            await makeReq(`${this.getAdminServerIP}/api/devices/check`, 'POST',{
                code: this.getSocketCode,
                id: this.getDeviceID
            })
            .then((data)=>{
                if(this.sockedCheckInterval){
                    clearInterval(this.sockedCheckInterval)
                    this.sockedCheckInterval = undefined
                    this.problems.value = false
                }

                if(data.statusCode==200){
                    console.log('[Socket] Connection possible');
                    // отправляем на auth
                    setTimeout(()=>{
                        // Clear dotes animation interval
                        clearInterval(this.dotesInterval)
                        this.dotesInterval = undefined
                        
                        this.initStep = 'success'
                        setTimeout(()=>{
                            this.setInitializationProcess(true)
                            this.$router.push('/auth')
                        }, 1000)
                    },2000)
                } else if(data.statusCode == 404 || data.statusCode == 403){ 
                    this.step = 'binding'
                    this.setSocketCode = undefined
                    this.setDeviceID = undefined
                }
            })
            .catch((error)=>{
                console.error('Error when cheked devise to socket connection with admin-server:', error)
                this.problems.value = true
                this.problems.type = 'socket-check'
                this.problems.msg = 'Не удаётся подключиться к управляющему серверу для проверки клиента. Как только подключение будет восстановлено, программа запуститься. Так же вы можете сменить IP-адреса серверов'

                if(!this.sockedCheckInterval && !this.blockIntervals){
                    this.sockedCheckInterval = setInterval(()=>{
                        this.checkSocket()
                    },5000)
                }
            })
        },

        async getData(){
            await makeReq(`${this.getAuthServerIP}/api/user/get`, 'POST',{
                auth:{
                    requesting: 'device'
                },
                data: {
                    device: {
                        code: this.getSocketCode,
                        id: this.getDeviceID
                    }
                }
            })
            .then(res=>{
                this.setUsersList(res.data.usersList)
            })

            await makeReq(`${this.getAdminServerIP}/api/subjects/get`, 'POST', {
                deviceData: {
                    code: this.getSocketCode,
                    id: this.getDeviceID
                }
            })
            .then((res)=>{
                this.setSubjects(res.data.subjects)
            })

            await makeReq(`${this.getAdminServerIP}/api/departments/get`, 'POST', {
                deviceData: {
                    code: this.getSocketCode,
                    id: this.getDeviceID
                }
            })
            .then((res)=>{
                this.setDepartments(res.data.departments)
            })
        }
    },
    mounted(){
        // Dotes
        this.dotesInterval = setInterval(()=>{
            if(this.dotes.counter<3){
                this.dotes.ctx=this.dotes.ctx+'.'
                this.dotes.counter++
            } else {
                this.dotes.ctx = ''
                this.dotes.counter=0
            }
        },500)


        // обозначаем текущий step
        this.step = 'initialization'

        const adminServerIp = localStorage.getItem('st-admin-server')
        const examServerIp = localStorage.getItem('st-exam-server')
        const authServerIp = localStorage.getItem('sa-auth-server')
        const socketCode= localStorage.getItem('socket-code')
        const deviceID = localStorage.getItem('device-id')

        // Проверка зависимостей
        if(adminServerIp){
            this.setAdminServerIP(adminServerIp)
        }
        if(examServerIp){
            this.setExamServerIP(examServerIp)
        }
        if(authServerIp){
            this.setAuthServerIP(authServerIp)
        }
        if(socketCode){
            this.setSocketCode(socketCode)
        }
        if(deviceID){
            this.setDeviceID(deviceID)
        }

        if(!adminServerIp || !examServerIp || !authServerIp){
            this.step = 'servers-hand-shake'
            clearInterval(this.dotesInterval)
            this.dotesInterval = undefined
        } else if(!socketCode || !deviceID){
            this.step = 'binding'
            clearInterval(this.dotesInterval)
            this.dotesInterval = undefined
        } else {

            // Проверка подключения к серверам
            setTimeout(async ()=>{
                this.initStep = 'handShakeWithServers'

                this.handShakeWithAdminServer()
            },2000)

            // Проверка актульности сокет-соединения
        }
    },
    unmounted(){
        clearInterval(this.dotesInterval)
        clearInterval(this.adminServerInterval)
        clearInterval(this.examServerInterval)
        clearInterval(this.authServerInterval)
        clearInterval(this.sockedCheckInterval)
    },
    components:{
        ServerIpForm,
        BindForm,
        SpinnerComponent
    }
}
</script>

<style scoped>
.wrapper{
    height: 100vh;
    width: 100%;
}
</style>
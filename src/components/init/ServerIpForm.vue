<template>
        <div class="form">
            <div class="form__header">
                <div class="d-flex align-center mb-2">
                    <v-icon size="30" color="var(--main-color)">mdi-server-network</v-icon>
                    <span class="ml-1 text-h6">Укажите IP-адреса серверов</span>
                </div>
                <v-divider></v-divider>
            </div>

            <div class="form__body mt-7 d-flex flex-column" style="gap:20px">
                <div class="d-flex flex-column">
                    <div class="d-flex justify-space-between flex-row align-center">
                        <div class="d-flex align-center mb-1">
                            <v-icon size="20" color="var(--main-color)">mdi-ip</v-icon>
                            <span class="ml-1">Укажите IP-адрес <b style="font-weight: 410;">управляющего сервера</b></span>
                        </div>

                        <v-icon size="19">mdi-information-outline</v-icon>
                    </div>
                    <div style="width: 100%;">
                        <v-text-field
                        placeholder="protocol://ip-adress:host"
                        variant="outlined"
                        density="compact"
                        :rules="[rules.adminFormat]"
                        v-model="adminServerIp"
                        :error="adminServerIpError.value"
                        :error-messages="adminServerIpError.msg"
                        hint="Введите полный адрес управляющего сервера"
                        :disabled="loader"
                        ></v-text-field>
                    </div>
                </div>

                
                <div class="d-flex flex-column">
                    <div class="d-flex justify-space-between flex-row align-center">
                        <div class="d-flex align-center mb-1">
                            <v-icon size="20" color="var(--main-color)">mdi-ip</v-icon>
                            <span class="ml-1">Укажите IP-адрес <b style="font-weight: 410;">сервера-раздатчика</b></span>
                        </div>

                        <v-icon size="19">mdi-information-outline</v-icon>
                    </div>
                    <div style="width: 100%;">
                        <v-text-field
                        placeholder="protocol://ip-adress:host"
                        variant="outlined"
                        density="compact"
                        :rules="[rules.examFormat]"
                        v-model="examServerIp"
                        :error="examServerIpError.value"
                        :error-messages="examServerIpError.msg"
                        :disabled="loader"
                        hint="Введите полный адрес сервера-раздатчика"
                        ></v-text-field>
                    </div>
                </div>

                
                <div class="d-flex flex-column">
                    <div class="d-flex justify-space-between flex-row align-center">
                        <div class="d-flex align-center mb-1">
                            <v-icon size="20" color="var(--main-color)">mdi-ip</v-icon>
                            <span class="ml-1">Укажите IP-адрес <b style="font-weight: 410;">сервера аутентификации</b></span>
                        </div>

                        <v-icon size="19">mdi-information-outline</v-icon>
                    </div>
                    <div style="width: 100%;">
                        <v-text-field
                        placeholder="protocol://ip-adress:host"
                        variant="outlined"
                        density="compact"
                        :rules="[rules.authFormat]"
                        v-model="authServerIp"
                        :error="authServerIpError.value"
                        :error-messages="authServerIpError.msg"
                        :disabled="loader"
                        hint="Введите полный адрес сервера аутентификации"
                        ></v-text-field>
                    </div>
                </div>

                <div class="d-flex flex-column">
                    <div class="d-flex justify-space-between flex-row align-center">
                        <div class="d-flex align-center mb-1">
                            <v-icon size="20" color="var(--main-color)">mdi-ip</v-icon>
                            <span class="ml-1">Укажите IP-адрес <b style="font-weight: 410;">сервера поддержки</b></span>
                        </div>

                        <v-icon size="19">mdi-information-outline</v-icon>
                    </div>
                    <div style="width: 100%;">
                        <v-text-field
                        placeholder="protocol://ip-adress:host"
                        variant="outlined"
                        density="compact"
                        :rules="[rules.helperFormat]"
                        v-model="helperServerIp"
                        :error="helperServerIpError.value"
                        :error-messages="helperServerIpError.msg"
                        :disabled="loader"
                        hint="Введите полный адрес сервера поддержки"
                        ></v-text-field>
                    </div>
                </div>

                <div class="d-flex justify-center">
                    <v-btn
                    v-if="!loader"
                    density="compact"
                    :color="!examIpIsValid || !adminIpIsValid || !authIpIsValid || !helperIpIsValid || blockBtn || adminServerIpError.value || authServerIpError.value || examServerIpError.value || helperServerIpError.value ? '#eee' : 'var(--main-color)'"
                    :disabled="!examIpIsValid || !adminIpIsValid || !authIpIsValid || !helperIpIsValid  || blockBtn || adminServerIpError.value || authServerIpError.value || helperServerIpError.value || examServerIpError.value "
                    @click="makeHandShakeWithServers()"
                    >
                    <span :style="!examIpIsValid || !adminIpIsValid || !authIpIsValid || !helperIpIsValid || blockBtn || adminServerIpError.value || authServerIpError.value || helperServerIpError.value || examServerIpError.value ? '#444' : 'color: #fff'">Подключиться</span>
                    </v-btn>
                    
                    <v-progress-circular
                    :width="1"
                    size="15"
                    color="var(--main-color)"
                    indeterminate
                    v-else
                    ></v-progress-circular>
                </div>
            </div>
            
            <div
            class="alerts-box mt-5"
            v-if="error.value || success"
            >
                <v-alert
                density="compact"
                color="var(--red-color)"
                v-if="error.value"
                >
                    <div class="d-flex align-center">
                        <v-icon size="19" color="#fff">mdi-alert-circle-outline</v-icon>
                        <span style="color: #fff" class="ml-1">{{ error.msg }}</span>
                    </div>
                </v-alert>
                
                <v-alert
                density="compact"
                color="var(--main-color)"
                v-if="success"
                class="d-flex flex-row align-center"
                >
                    <v-icon color="#fff" class="mr-1">mdi-check</v-icon>
                    <span style="color:#fff">IP-адреса северов успешно установлены</span>
                </v-alert>
            </div>
        </div>
</template>

<script>
import makeReq from '@/utils/makeReq'
import { mapMutations, mapGetters } from 'vuex';

export default {
    props:{
        changeStep: Function
    },
    data(){
        return{
            rules: {
                adminFormat: (v) => {
                    const pattern = /^(http|https):\/\/.+:[0-9][0-9][0-9][0-9]/;
                    if (pattern.test(v)) {
                        this.adminIpIsValid = true;
                        return true;
                    } else {
                        this.adminIpIsValid = false;
                        return 'Неверный формат IP-адреса'
                    }
                },
                examFormat: (v) => {
                    const pattern = /^(http|https):\/\/.+:[0-9][0-9][0-9][0-9]/;
                    if (pattern.test(v)) {
                        this.examIpIsValid = true;
                        return true;
                    } else {
                        this.examIpIsValid = false;
                        return 'Неверный формат IP-адреса'
                    }
                },
                authFormat: (v) => {
                    const pattern = /^(http|https):\/\/.+:[0-9][0-9][0-9][0-9]/;
                    if (pattern.test(v)) {
                        this.authIpIsValid = true;
                        return true;
                    } else {
                        this.authIpIsValid = false;
                        return 'Неверный формат IP-адреса'
                    }
                },
                helperFormat: (v) => {
                    const pattern = /^(http|https):\/\/.+:[0-9][0-9][0-9][0-9]/;
                    if (pattern.test(v)) {
                        this.helperIpIsValid = true;
                        return true;
                    } else {
                        this.helperIpIsValid = false;
                        return 'Неверный формат IP-адреса'
                    }
                },
            },

            examIpIsValid: false,
            adminIpIsValid: false,
            authIpIsValid: false,
            helperIpIsValid: false,
            loader: false,
            success: false,
            error: {
                value: false,
                msg: undefined
            },
            blockBtn: false,

            adminServerIp: undefined,
            adminServerIpError:{
                value: false,
                msg: undefined
            },

            examServerIp: undefined,
            examServerIpError:{
                value: false,
                msg: undefined
            },

            authServerIp: undefined,
            authServerIpError: {
                value: false,
                msg: undefined
            },

            helperServerIp: undefined,
            helperServerIpError: {
                value: false,
                msg: undefined
            }

        }
    },
    computed: mapGetters(['getSocketCode', 'getAdminServerIP', 'getExamServerIP', 'getAuthServerIP', 'getHelperServerIP']),
    methods:{
        ...mapMutations(['setAdminServerIP', 'setExamServerIP', 'setAuthServerIP', 'setHelperServerIP']),

        async makeHandShakeWithServers(){
            if(this.adminServerIp && this.examServerIp && this.authServerIp && this.helperServerIp && !this.adminServerIpError.value && !this.examServerIpError.value && !this.authServerIpError.value && !this.helperServerIpError.value){
                this.loader = true
                this.blockBtn = true
                // Hand shake with admin server
                await makeReq(`${this.adminServerIp}/api/ping`, 'GET')
                .then((data)=>{
                    if(data.statusCode==200){
                        if(data.data.server=='st-admin-server'){
                            console.log('[ST-Admin] Ok.');
                        } else {
                            this.error.value = true
                            this.error.msg = 'Данный сервер не является управляющим'
                            this.adminServerIpError.value = true
                            this.loader = false
                            this.blockBtn = false
                            return
                        }
                    }
                })
                .catch(error=>{
                    console.error(`[ERROR] Handshake error: ${error}`);
                    this.error.value = true
                    this.error.msg = 'Неудаёться отправить запрос на управляющий сервер'
                    this.adminServerIpError.value = true
                    this.loader = false
                    this.blockBtn = false
                })

                if(this.adminServerIpError.value || this.error.value){
                    return
                }

                // Hand shake with exam server
                await makeReq(`${this.examServerIp}/api/ping`, 'GET')
                .then((data)=>{
                    if(data.statusCode==200){
                        if(data.data.server=='st-exam-server'){
                            console.log('[ST-Exam] Ok.');
                        } else {
                            this.error.value = true
                            this.error.msg = 'Данный сервер не является раздающим'
                            this.examServerIpError.value = true
                            this.loader = false
                            this.blockBtn = false
                        }
                    }

                    if(this.examServerIpError.value || this.error.value){
                        return
                    }
                })
                .catch(error=>{
                    console.error(`[ERROR] Handshake error: ${error}`);
                    this.error.value = true
                    this.error.msg = 'Неудаёться отправить запрос на раздающий сервер'
                    this.examServerIpError.value = true
                    
                    this.loader = false
                    this.blockBtn = false
                    return
                })

                if(this.adminServerIpError.value || this.error.value){
                    return
                }

                // Hand shake with auth server
                await makeReq(`${this.authServerIp}/api/ping`, 'GET')
                .then((data)=>{
                    if(data.statusCode==200){
                        if(data.data.server=='st-auth-server'){
                            console.log('[SA-Auth] Ok.');
                        } else {
                            this.error.value = true
                            this.error.msg = 'Данный сервер не является сервером аутентификации'
                            this.authServerIpError.value = true
                            this.loader = false
                            this.blockBtn = false
                        }
                    }

                    if(this.authServerIpError.value || this.error.value){
                        return
                    }
                })
                .catch(error=>{
                    console.error(`[ERROR] Handshake error: ${error}`);
                    this.error.value = true
                    this.error.msg = 'Неудаёться отправить запрос на сервер аутентификации'
                    this.authServerIpError.value = true
                    
                    this.loader = false
                    this.blockBtn = false
                    return
                })

                if(this.adminServerIpError.value || this.error.value){
                    return
                }

                // Hand shake with helper server
                await makeReq(`${this.helperServerIp}/api/ping`, 'GET')
                .then((data)=>{
                    if(data.statusCode==200){
                        if(data.data.server=='st-helper-server'){
                            console.log('[ST-Helper] Ok.');
                        } else {
                            this.error.value = true
                            this.error.msg = 'Данный сервер не является сервером поддержки'
                            this.helperServerIpError.value = true
                            this.loader = false
                            this.blockBtn = false
                        }
                    }

                    if(this.helperServerIpError.value || this.error.value){
                        return
                    }
                })
                .catch(error=>{
                    console.error(`[ERROR] Handshake error: ${error}`);
                    this.error.value = true
                    this.error.msg = 'Неудаёться отправить запрос на сервер поддержки'
                    this.helperServerIpError.value = true
                    
                    this.loader = false
                    this.blockBtn = false
                    return
                })

                if(this.adminServerIpError.value || this.error.value){
                    return
                }

                // Устанавливаем значения в ls
                localStorage.setItem('st-admin-server', this.adminServerIp)
                localStorage.setItem('st-exam-server', this.examServerIp)
                localStorage.setItem('sa-auth-server', this.authServerIp)
                localStorage.setItem('st-helper-server', this.helperServerIp)
                // State
                this.setAdminServerIP(this.adminServerIp)
                this.setExamServerIP(this.examServerIp)
                this.setAuthServerIP(this.authServerIp)
                this.setHelperServerIP(this.helperServerIp)
                
                this.success = true
                this.loader = false
                setTimeout(()=>{
                    this.success = false
                    if(this.getSocketCode){
                        location.reload()
                    } else {
                        this.changeStep('binding')
                    }
                    this.blockBtn = false
                },3000)
            }
        }
    },
    mounted(){
        if(this.getAdminServerIP){
            this.adminServerIp = this.getAdminServerIP
        }
        if(this.getExamServerIP){
            this.examServerIp = this.getExamServerIP
        }
        if(this.getAuthServerIP){
            this.authServerIp = this.getAuthServerIP
        }
        if(this.getHelperServerIP){
            this.helperServerIp = this.getHelperServerIP
        }
    },
    watch:{
        adminServerIp(){
            if(this.adminServerIp){
                this.adminServerIpError.value = false
                this.error.value = false
            }
        },
        
        examServerIp(){
            if(this.examServerIp){
                this.examServerIpError.value = false
                this.error.value = false
            }
        },
        
        authServerIp(){
            if(this.authServerIp){
                this.authServerIpError.value = false
                this.error.value = false
            }
        },
        
        helperServerIp(){
            if(this.helperServerIp){
                this.helperServerIpError.value = false
                this.error.value = false
            }
        }
    }
}
</script>


<style scoped>
.form{
    width: 45vw;
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0px 3px 4px -1px rgb(0 0 0 / 20%), 0px 4px 20px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
    transition: box-shadow 0.5s ease-in-out;
}
.form:hover{
    box-shadow: 0px 6px 8px -1px rgb(0 0 0 / 20%), 0px 8px 40px 0px rgb(0 0 0 / 14%), 0px 5px 14px 0px rgb(0 0 0 / 12%);
}
</style>

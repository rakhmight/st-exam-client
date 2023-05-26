<template>
    <div class="form">
        <div class="form__header">
            <div class="d-flex align-center mb-2">
                <v-icon size="30" color="var(--main-color)">mdi-link-variant</v-icon>
                <span class="ml-1 text-h6">Привяжите клиент к управляющему серверу</span>
            </div>
            <v-divider></v-divider>
        </div>

        <div class="form__body mt-7 d-flex flex-column" style="gap:20px">
            <div class="d-flex flex-column">
                <div class="d-flex justify-space-between flex-row align-center">
                    <div class="d-flex mb-1">
                        <v-icon size="20" color="var(--main-color)" style="margin-top: 3px;">mdi-key-variant</v-icon>
                        <span class="ml-2">Введите <b style="font-weight: 410;">секретный код</b> сгенерированный управляющим сервером для привязки текущего клиента</span>
                    </div>

                    <v-icon size="19">mdi-information-outline</v-icon>
                </div>
                <div style="width: 100%;" class="mt-1">
                    <v-text-field
                    placeholder="Введите код"
                    variant="outlined"
                    density="compact"
                    hint="Введите секретный код для привязки"
                    v-model="code"
                    :disabled="loader"
                    :error="error.value"
                    ></v-text-field>
                </div>
            </div>

            <div class="d-flex justify-center">
                <v-btn
                v-if="!loader"
                density="compact"
                :color="blockBtn ? '#eee' : 'var(--main-color)'"
                :disabled="blockBtn"
                @click="bindToServer()"
                >
                <span :style="blockBtn ? '#444' : 'color: #fff'">Подключиться</span>
                </v-btn>
                
                <v-progress-circular
                :width="1"
                size="15"
                color="var(--main-color)"
                indeterminate
                v-else
                ></v-progress-circular>
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
                    <span style="color:#fff">Клиент успешно привязан</span>
                </v-alert>
            </div>
        </div>
    </div>
</template>

<script>
import makeReq from '@/utils/makeReq'
import { mapGetters, mapMutations } from 'vuex';

export default {
    data(){
        return {
            loader: false,
            blockBtn: true,
            error:{
                value: false,
                msg: undefined
            },
            success: false,

            code: undefined
        }
    },
    computed: mapGetters(['getAdminServerIP']),
    methods:{
        ...mapMutations(['setSocketCode', 'setDeviceID']),

        async bindToServer(){
            if(this.code){
                this.loader = true
                this.blockBtn = true
                await makeReq(`${this.getAdminServerIP}/api/devices/bind`, 'POST', {
                    code: this.code
                })
                .then((data)=>{
                    if(data.statusCode == 200){
                        this.success = true
                        this.loader = false
                        this.setSocketCode(this.code)
                        this.setDeviceID(data.data.deviceID)

                        localStorage.setItem('socket-code', this.code)
                        localStorage.setItem('device-id', data.data.deviceID)
                        
                        setTimeout(()=>{
                            location.reload()
                        },3000)
                    } else if(data.statusCode == 404){
                        this.loader = false
                        this.error.value = true
                        this.error.msg = 'Неверный код'
                    } else if(data.statusCode == 403){
                        this.loader = false
                        this.error.value = true
                        this.error.msg = 'С этим кодом уже привязано другое устройство'
                    }
                })
            }
        }
    },
    watch:{
        code(){
            if(this.code){
                this.code = this.code.toUpperCase()
                this.blockBtn = false
                this.error.value = false
            } else {
                this.blockBtn = true
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

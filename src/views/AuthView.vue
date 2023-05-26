<template>
    <div class="auth">

        <div class="auth__header">
            <div class="header__title">
                <span class="text-h6 text-end" style="color: var(--main-color)">SMART TESTING EXAM CLIENT</span>
                <div><v-img src="@/assets/media/auth_icon.svg" width="70px"></v-img></div>
                <span class="text-h6" style="color: var(--main-color)">AUTHENTICATION SERVER</span>
            </div>

            <div class="header__bg"><div class="bg-chapter1"></div></div>
            <div class="header__bg"><div class="bg-chapter2"></div></div>
        </div>

        <div class="auth__main d-flex flex-column">
            <div class="form d-flex flex-column" style="gap:20px">
                <div class="d-flex align-center justify-center" style="gap:10px">
                    <div><v-img src="@/assets/media/logo.png" width="70px" height="70px"></v-img></div>
                    <span class="text-h6">Введите данные для входа</span>
                </div>

                <div class="mt-5 align-start" style="display:grid; gap:20px; grid-template-columns: 100px auto;">
                    <div class="d-flex align-center mt-2">
                        <v-icon size="19" color="var(--main-color)">mdi-login</v-icon>
                        <span class="ml-2" style="color: #555">Логин</span>
                    </div>
                    <v-text-field
                    variant="outlined"
                    density="compact"
                    placeholder="Введите логин"
                    color="var(--main-color)"
                    v-model="login"
                    :error="loginError.value"
                    :error-messages="loginError.msg"
                    ></v-text-field>
                </div>
                <div class="align-start" style="gap:20px; display:grid; gap:20px; grid-template-columns: 100px auto;">
                    <div class="d-flex align-center mt-2">
                        <v-icon size="19" color="var(--main-color)">mdi-key-variant</v-icon>
                        <span class="ml-2" style="color: #555">Пароль</span>
                    </div>
                    <v-text-field
                    variant="outlined"
                    density="compact"
                    placeholder="Введите пароль"
                    color="var(--main-color)"
                    v-model="password"
                    :error="passwordError.value"
                    :error-messages="passwordError.msg"
                    ></v-text-field>
                </div>
                <div class="d-flex justify-center">
                    <v-btn
                    density="compact"
                    :color="blockBtn ? '#eee' : 'var(--main-color)'"
                    width="200px"
                    @click="auth()"
                    :disabled="blockBtn"
                    >
                    <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Войти</span>
                    <v-progress-circular
                        :width="1"
                        size="15"
                        color="var(--main-color)"
                        indeterminate
                        v-else
                    ></v-progress-circular>
                    </v-btn>
                </div>
            </div>

            <div
            class="alerts-box mt-5"
            style="width: 700px;"
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
                    <span style="color:#fff">Успешная авторизация</span>
                </v-alert>
            </div>
                    

            <div class="main__clouds-animation">
                <div class="cloud third-cloud"></div>
                <div class="cloud first-cloud"></div>
                <div class="cloud second-cloud"></div>
                <div class="cloud fourth-cloud"></div>
            </div>

            <div class="main__back-bg"></div>
        </div>

        <div class="auth__footer">
            <div>
                <!-- Lang -->
            </div>

            <div>
                <span>ST Exam client v.0.1</span>
            </div>
        </div>

    </div>
</template>

<script>
import { socket } from '@/socket';
import { mapGetters, mapMutations } from 'vuex';
import makeReq from '@/utils/makeReq';

export default {
    data(){
        return {
            loginError: {
                value: false,
                msg: undefined
            },
            passwordError: {
                value: false,
                msg: undefined
            },
            error:{
                value: false,
                msg: undefined
            },
            blockBtn: true,
            loader: false,
            success: false,

            login: undefined,
            password: undefined
        }
    },
    computed: mapGetters(['getInitializationProcess', 'getAuthServerIP', 'getAuthState']),
    mounted(){
        if(this.getInitializationProcess){
            socket.connect()
        } else {
            this.$router.push('/')
        }

        if(this.getAuthState){
            this.$router.push('/coordinator')
        }
    },
    methods:{
        ...mapMutations(['setUserData']),

        async auth(){
            if(this.login && this.password){
                this.loader = true
                this.blockBtn = true
                makeReq(`${this.getAuthServerIP}/api/users/auth`, 'POST', {
                    data:{
                        login: this.login,
                        password: this.password
                    }
                })
                .then(data=>{
                    if(data.status == 404 && data.des=='pass'){
                        this.passwordError.value = true
                        this.passwordError.msg = 'Неверный пароль пользователя'
                        this.loader = false
                    } else if(data.status == 404 && data.des=='login'){
                        this.loginError.value = true
                        this.loginError.msg = 'Такого пользователя не существует'
                        this.loader = false
                    } else if(data.status == 500){
                        this.error.value = true
                        this.error.msg = 'Временные неполадки на стороне Auth-сервера'
                        this.loader = false
                    } else if(data.status == 200) {
                        this.loader = false
                        this.success = true

                        this.setUserData(data.user)
                        localStorage.setItem('userData', JSON.stringify(data.user))
                        this.$router.push('/coordinator')
                        // route to coordinator vue

                        setTimeout(()=>{
                            this.success = false
                            this.login = undefined
                            this.password = undefined
                        },3000)
                    }
                })
                .catch(error=>{
                    console.log(error);
                    this.error.value = true
                    this.error.msg = 'Auth-сервер не отвечает'
                    this.loader = false
                })
            }
        }
    },
    watch:{
        login(){
            if(this.login && this.password){
                this.blockBtn = false
            } else {
                this.blockBtn = true
            }

            if(this.login){
                this.loginError.value = false
                this.error.value = false
                this.loginError.msg = undefined
            }
        },
        password(){
            if(this.login && this.password){
                this.blockBtn = false
            } else {
                this.blockBtn = true
            }

            if(this.password){
                this.passwordError.value = false
                this.passwordError.msg = undefined
                this.error.value = false
            }
        }
    }
}
</script>

<style scoped>
.auth{
    min-height: 100%;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.auth__header{
    width:100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    height: 150px;
}
.header__title{
    width: 100%;
    position: absolute;
    display: grid;
    grid-template-columns: 1fr 70px 1fr;
    align-items: center;
    justify-content: center;
    gap:20px;
    top: 15px;
}
.header__bg{
    width: 100%;
    position: relative;
}
.bg-chapter1{
    position: absolute;
    background-image: url('@/assets/media/header_bg_ch1.svg');
    height: 100%;
    width: 415px;
}
.bg-chapter2{
    position: absolute;
    background-image: url('@/assets/media/header_bg_ch2.svg');
    height: 100%;
    width: 480px;
    right:0;
}

.auth__main{
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.main__back-bg{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    background-image: url('@/assets/media/main-bg.svg');
    z-index: 1;
    background-position: center;
    opacity: 0.4;
}
.main__clouds-animation {
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 2;
}
.cloud {
    width: 342px;
    height: 158px;
    background-image: url('@/assets/media/cloud.svg');
    animation-name: clouds;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}
.first-cloud{
    animation-duration: 60s;
}
.second-cloud{
    animation-duration: 80s;
}
.third-cloud{
    animation-duration: 100s;
}
.fourth-cloud{
    animation-duration: 120s;
}
@keyframes clouds {
    0%{
        transform: translateX(-342px);
        opacity: 0;
    }
    25%{
        opacity: 1;
    }
    75%{
        opacity: 1;
    }
    100%{
        transform: translateX(1920px);
        opacity: 0;
    }
}
.form{
    width: 700px;
    padding: 30px;
    background-color: #ffffff9a;
    border-radius: 10px;
    position: relative;
    z-index: 3;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 4px 5px, rgba(0, 0, 0, 0.22) 0px 8px 10px;
    transition: box-shadow 0.5s ease, background-color 0.5s ease;
}
.form:hover{
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 8px 10px, rgba(0, 0, 0, 0.22) 0px 16px 20px;
}

.auth__footer{
    padding: 10px 20px;
    background-color: #444;
    display: flex;
    justify-content: space-between;
    color: #9e9e9e;
    font-size: 0.9em
}
</style>

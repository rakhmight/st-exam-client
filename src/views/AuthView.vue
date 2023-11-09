<template>
    <div class="auth">

        <div class="auth__header">
            <div class="header__title">
                <span class="text-h6 text-end" style="color: var(--main-color)">SMART TESTING EXAM CLIENT</span>
                <div><v-img src="@/assets/media/auth_icon.png" width="70px"></v-img></div>
                <span class="text-h6" style="color: var(--main-color)">SIMPLIFIED AUTH PROCESS</span>
            </div>

            <div class="header__bg"><div class="bg-chapter1"></div></div>
            <div class="header__bg"><div class="bg-chapter2"></div></div>
        </div>

        <div class="auth__main d-flex flex-column">
            <div class="form d-flex flex-column" style="gap:20px">
                <div class="d-flex align-center justify-center" style="gap:10px;">
                    <div><v-img src="@/assets/media/logo.png" width="70px" height="70px"></v-img></div>
                    <span class="text-h6">{{ currentLang.authView[0] }}</span>
                </div>

                <div style="flex: 1 1 auto; width: 100%" class="d-flex flex-column align-center justify-center">
                    
                    <div v-if="!userRole" class="d-flex flex-column w-100" style="gap:15px">
                        <div class="d-flex justify-center">
                            <span><b>{{ currentLang.authView[1] }}</b></span>
                        </div>
                        <v-select
                        color="var(--main-color)"
                        density="compact"
                        variant="outlined"
                        :placeholder="`  ${currentLang.authView[2]}`"
                        :items="roles"
                        v-model="userRole"
                        autofocus
                        ></v-select>
                    </div>

                    <div
                    class="d-flex flex-column w-100"
                    style="gap:15px"
                    v-if="userRole && userRole=='student' && !formOfStudy || userRole && userRole=='enrollee' && !formOfStudy"
                    >
                        <div class="d-flex align-center mt-2">
                            <v-icon size="19" color="var(--main-color)">mdi-notebook</v-icon>
                            <span class="ml-2" style="color: #555">{{ currentLang.authView[3] }}</span>
                        </div>                    
                        <v-select
                        color="var(--main-color)"
                        density="compact"
                        variant="outlined"
                        :placeholder="`  ${currentLang.authView[4]}`"
                        :items="forms"
                        v-model="formOfStudy"
                        autofocus
                        ></v-select>
                    </div>

                    <div
                    class="d-flex flex-column w-100"
                    style="gap:15px"
                    v-if="userRole && userRole=='student' && formOfStudy && !userCourse"
                    >
                        <div class="d-flex align-center mt-2">
                            <v-icon size="19" color="var(--main-color)">mdi-alpha-k-box-outline</v-icon>
                            <span class="ml-2" style="color: #555">{{ currentLang.authView[5] }}</span>
                        </div>                    
                        <v-select
                        color="var(--main-color)"
                        density="compact"
                        variant="outlined"
                        :placeholder="`  ${currentLang.authView[6]}`"
                        :items="courses"
                        v-model="userCourse"
                        autofocus
                        ></v-select>
                    </div>

                    <div
                    class="d-flex flex-column w-100"
                    style="gap:15px"
                    v-if="userCourse && userRole=='student' && !userGroup || userRole=='enrollee' && !userGroup && formOfStudy"
                    >
                        <div class="d-flex align-center mt-2">
                            <v-icon size="19" color="var(--main-color)">mdi-account-group</v-icon>
                            <span class="ml-2" style="color: #555">{{ currentLang.authView[7] }}</span>
                        </div>                    
                        <v-select
                        color="var(--main-color)"
                        density="compact"
                        variant="outlined"
                        :placeholder="`  ${currentLang.authView[8]}`"
                        :items="groups"
                        v-model="userGroup"
                        autofocus
                        ></v-select>
                    </div>

                    <div
                    class="d-flex flex-column w-100"
                    style="gap:15px"
                    v-if="userRole && userRole=='employee' && !userDepartment || userRole && userRole=='teacher' && !userDepartment"
                    >
                        <div class="d-flex align-center mt-2">
                            <v-icon size="19" color="var(--main-color)">mdi-account-group</v-icon>
                            <span class="ml-2" style="color: #555" v-if="userRole=='employee'">{{ currentLang.authView[9] }}</span>
                            <span class="ml-2" style="color: #555" v-if="userRole=='teacher'">{{ currentLang.authView[10] }}</span>
                        </div>                    
                        <v-select
                        color="var(--main-color)"
                        density="compact"
                        variant="outlined"
                        :placeholder="userRole=='employee' ? `  ${currentLang.authView[11]}` : `  ${currentLang.authView[12]}`"
                        :items="departmentsList"
                        v-model="userDepartment"
                        autofocus
                        ></v-select>
                    </div>

                    <div
                    class="d-flex flex-column w-100"
                    style="gap:15px"
                    v-if="userRole=='student' && userGroup && !userName || userRole=='enrollee' && userGroup && !userName || userRole=='teacher' && userDepartment && !userName || userRole=='employee' && userDepartment && !userName"
                    >
                        <div class="d-flex align-center mt-2">
                            <v-icon size="19" color="var(--main-color)">mdi-account</v-icon>
                            <span class="ml-2" style="color: #555">{{ currentLang.authView[13] }}</span>
                        </div>                    
                        <v-select
                        color="var(--main-color)"
                        density="compact"
                        variant="outlined"
                        :placeholder="`  ${currentLang.authView[14]}`"
                        :items="usersList"
                        v-model="userName"
                        :no-data-text="currentLang.authView[15]"
                        autofocus
                        class="selectScroll"
                        ></v-select>
                    </div>

                    <div
                    class="d-flex flex-column w-100"
                    style="gap:15px;"
                    v-if="userName"
                    >
                        <div class="d-flex align-center mt-2">
                            <v-icon size="19" color="var(--main-color)">mdi-key-variant</v-icon>
                            <span class="ml-2" style="color: #555">{{ currentLang.authView[16] }}</span>
                        </div>
                        <v-text-field
                        variant="outlined"
                        density="compact"
                        :placeholder="`  ${currentLang.authView[17]}`"
                        color="var(--main-color)"
                        v-model="password"
                        :error="passwordError.value"
                        :error-messages="passwordError.msg"
                        autofocus
                        ></v-text-field>
                    </div>

                    <div v-if="userRole">
                        
                        <v-btn
                        class="mt-2"
                        density="compact"
                        color="#eee"
                        width="200px"
                        @click="back()"
                        :disabled="loader || success"
                        variant="plain"
                        >
                        <v-icon color="#777" size="16">mdi-arrow-left</v-icon>
                        <span class="ml-1" style="color: #777; font-size: small;">{{ currentLang.authView[18] }}</span>
                        </v-btn>
                    </div>
                </div>

                <div class="d-flex justify-center" v-if="userName">
                    <v-btn
                    density="compact"
                    :color="blockBtn ? '#eee' : 'var(--main-color)'"
                    width="200px"
                    @click="auth()"
                    :disabled="blockBtn"
                    >
                    <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">{{ currentLang.authView[19] }}</span>
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
                    <span style="color:#fff">{{ currentLang.authView[20] }}</span>
                </v-alert>
            </div>
                    

            <div class="main__clouds-animation">
                <div class="cloud third-cloud">
                    <v-img src="@/assets/media/cloud.png"></v-img>
                </div>
                <div class="cloud first-cloud">
                    <v-img src="@/assets/media/cloud.png"></v-img>
                </div>
                <div class="cloud second-cloud">
                    <v-img src="@/assets/media/cloud.png"></v-img>
                </div>
                <div class="cloud fourth-cloud">
                    <v-img src="@/assets/media/cloud.png"></v-img>
                </div>
            </div>

            <div class="main__back-bg">
                <div style="width: 70%">
                    <v-img  src="@/assets/media/main-bg-h2.png"></v-img>
                </div>
            </div>
        </div>

        <div class="auth__footer">
            <div>
                <!-- Lang -->
            </div>

            <div>
                <span>ST Exam client v.{{ version }}</span>
            </div>
        </div>

    </div>
</template>

<script>
import { socket } from '@/socket';
import { mapGetters, mapMutations } from 'vuex';
import makeReq from '@/utils/makeReq';
import { getCourse } from '@/utils/getInfo';

export default {
    data(){
        return {
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
            roles: [],
            forms: [],
            courses: [1,2,3,4],
            groups: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200],

            password: undefined,
            userRole: undefined,
            formOfStudy: undefined,
            userCourse: undefined,
            userGroup: undefined,
            userName: undefined,
            userDepartment: undefined,

            usersList: [],
            departmentsList: [],

            currentYear: undefined,
            nextEducationYear: false,
            version: undefined
        }
    },
    computed: mapGetters(['getInitializationProcess', 'getAuthServerIP', 'getAuthState', 'getAdminServerIP', 'getUserData', 'getUsersList', 'getDepartments', 'getDeviceID', 'getSocketCode', 'currentLang']),
    async mounted(){
        this.version = process.env.VUE_APP_VERSION

        if(this.getInitializationProcess){
            socket.connect()
        } else {
            this.$router.push('/')
        }

        let currentDate = new Date()
        this.currentYear = currentDate.getFullYear()
        if(currentDate.getMonth()>8){
            this.nextEducationYear = true
        }

        document.addEventListener('keydown', this.handleEnterKey);

        this.choiseLists()
    },
    unmounted(){
        document.removeEventListener('keydown', this.handleEnterKey); // удаление обработчика
    },
    methods:{
        ...mapMutations(['setUserData', 'setAuthState']),

        handleEnterKey(){
            if(event.code=='Enter' || event.code == 'NumpadEnter'){
                if(this.password) this.auth()
            }
        },

        back(){
            this.userRole = undefined
            this.userDepartment = undefined
            this.userCourse = undefined
            this.userGroup = undefined
            this.userName = undefined
            this.password = undefined
            this.blockBtn = true
            this.formOfStudy = undefined
        },

        getCourse(year){
            if(this.nextEducationYear && this.currentYear-year!=3){
                return (this.currentYear-year)+1
            }
            return this.currentYear-year
        },

        async auth(){
            if(this.userName && this.password){
                this.loader = true
                this.blockBtn = true
                makeReq(`${this.getAuthServerIP}/api/user/auth`, 'POST', {
                    auth:{
                        id: this.userName,
                        password: this.password,
                        requesting: 'device'
                    },
                    deviceData:{
                        id: this.getDeviceID,
                        code: this.getSocketCode
                    }
                })
                .then(async (data)=>{
                    console.log(data);
                    if(data.statusCode == 404){
                        this.passwordError.value = true
                        this.passwordError.msg = this.currentLang.authView[21]
                        this.loader = false
                    } else if(data.statusCode == 500){
                        this.error.value = true
                        this.error.msg = this.currentLang.authView[22]
                        this.loader = false
                    } else if(data.statusCode == 200) {
                        this.loader = false
                        this.success = true

                        const userData = { userData: data.data.userData, authData: data.data.authData }
                        this.setUserData(userData)
                        this.setAuthState(true)

                        setTimeout(()=>{
                            this.success = false
                            this.$router.push('/coordinator')
                            this.back()
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
        },

        choiseLists(){
            const rolesList = []
            const formsList = []
            const coursesList = []
            const groupsList = []
            const departmentsList = []

            this.getUsersList.map(user => {
                const targetRole = rolesList.find(role => role == user.userRole)
                if(!targetRole) rolesList.push(user.userRole)
//l
                if(user.userRole == 'student' || user.userRole == 'enrollee'){
                    const targetForm = user.userRole == 'student' ? formsList.find(form => form == user.roleProperties.educationForm) : formsList.find(form => form == user.roleProperties.formOfEducation)
                    if(!targetForm) formsList.push(user.userRole == 'student' ? user.roleProperties.educationForm : user.roleProperties.formOfEducation)

                    if(user.userRole == 'student'){
                        const userCourse = getCourse(user.roleProperties.recieptDate)
                        const targetCourse = coursesList.find(course => course.value == userCourse)
                        if(!targetCourse) coursesList.push({ title: `${userCourse}-${this.currentLang.authView[31]}`, value: userCourse })
                    }

                    const targetGroup = groupsList.find(group => group.value == user.roleProperties.group)
                    if(!targetGroup) groupsList.push({ title: (''+user.roleProperties.group).length == 1 ? `${getCourse(user.roleProperties.recieptDate)}0${user.roleProperties.group} ${this.currentLang.authView[30]}` : `${getCourse(user.roleProperties.recieptDate)}${user.roleProperties.group} ${this.currentLang.authView[30]}`, value: user.roleProperties.group })
                }

                if(user.userRole == 'teacher' || user.userRole == 'employee') {
                    const targetDepartment = departmentsList.find(department => department == user.roleProperties.department)
                    if(!targetDepartment) departmentsList.push(user.roleProperties.department)
                }
            })

            this.roles = rolesList.map(role => {
                if(role == 'student') return { title: this.currentLang.authView[23], value: role }
                if(role == 'enrollee') return { title: this.currentLang.authView[24], value: role }
                if(role == 'teacher') return { title: this.currentLang.authView[25], value: role }
                if(role == 'employee') return { title: this.currentLang.authView[26], value: role }
            })
            if(rolesList.length == 1) this.userRole = rolesList[0]
            else this.userRole = undefined

            this.forms = formsList.map(form => {
                if(form == 'full-time') return { title: this.currentLang.authView[27], value: form }
                if(form == 'in-absentia') return { title: this.currentLang.authView[28], value: form }
                if(form == 'magistracy') return { title: this.currentLang.authView[29], value: form }
            })
            if(formsList.length == 1 && !departmentsList.length && this.userRole) this.formOfStudy = formsList[0]
            else this.formOfStudy = undefined

            this.courses = coursesList
            if(coursesList.length == 1 && this.formOfStudy) this.userCourse = coursesList[0]
            else this.userCourse = undefined

            this.groups = groupsList
            if(groupsList.length == 1 && this.userCourse) this.userGroup = groupsList
            else this.userGroup = undefined

            this.departmentsList = departmentsList
            if(departmentsList.length == 1 && !formsList.length && this.userRole) this.userDepartment = departmentsList[0]
            else this.userDepartment = undefined

        },

        sortUsers(){
            this.usersList = []

            if(this.userRole == 'teacher' || this.userRole=='employee'){
                this.getUsersList.forEach(user=>{
                    if(user.userRole == 'teacher' || user.userRole == 'employee'){
                        if(user.roleProperties.department == this.userDepartment && !this.usersList.find(u => u.value == user.id)){
                            this.usersList.push({
                                title: `${user.bio.firstName ? user.bio.firstName : ''} ${user.bio.lastName ? user.bio.lastName : ''} ${user.bio.patronymic ? user.bio.patronymic : ''}`,
                                value: user.id
                            })
                        }
                    }
                })
            } else if(this.userRole == 'student'){
                this.getUsersList.forEach(user=>{
                    if(user.userRole == 'student'){
                        if(this.getCourse(user.roleProperties.recieptDate) == this.userCourse && user.roleProperties.group == this.userGroup && user.roleProperties.educationForm == this.formOfStudy && !this.usersList.find(u => u.value == user.id)){
                            this.usersList.push({
                                title: `${user.bio.firstName ? user.bio.firstName : ''} ${user.bio.lastName ? user.bio.lastName : ''} ${user.bio.patronymic ? user.bio.patronymic : ''}`,
                                value: user.id
                            })
                        }
                    }
                })
            } else if(this.userRole == 'enrollee'){
                this.getUsersList.forEach(user=>{
                    if(user.userRole == 'enrollee'){
                        if(user.roleProperties.group == this.userGroup && user.roleProperties.educationForm == this.formOfStudy && !this.usersList.find(u => u.value == user.id)){
                            this.usersList.push({
                                title: `${user.bio.firstName ? user.bio.firstName : ''} ${user.bio.lastName ? user.bio.lastName : ''} ${user.bio.patronymic ? user.bio.patronymic : ''}`,
                                value: user.id
                            })
                        }
                    }
                })
            }

            // console.log(this.usersList);
            // const usersListWithoutDouble = new Set(this.usersList)
            // this.usersList = Array.from(usersListWithoutDouble);
        }
    },
    watch:{

        currentLang(){
            this.choiseLists()
        },

        getUsersList(){
            this.usersList = []
            this.choiseLists()
        },
        'getUsersList.length'(){
            this.usersList = []
            this.choiseLists()
        },
        password(){

            if(this.password){
                this.passwordError.value = false
                this.passwordError.msg = undefined
                this.error.value = false
                this.blockBtn = false
            } else {
                this.blockBtn = true
            }
        },

        userGroup(){
            this.sortUsers()
        },

        userDepartment(){
            this.sortUsers()
        },

        userRole(){
            if(this.userRole == 'teacher' || this.userRole=='employee'){
                this.departmentsList = []

                this.getDepartments.forEach(dep=>{
                    if(this.userRole == 'teacher' && dep.type=='chair' || this.userRole=='employee' && dep.type=='general'){
                        this.departmentsList.push({
                            title: dep.name.ru,
                            value: dep.id
                        })
                    }
                })
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
    background-image: url('@/assets/media/header_bg_ch1.png');
    height: 100%;
    width: 415px;
}
.bg-chapter2{
    position: absolute;
    background-image: url('@/assets/media/header_bg_ch2.png');
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
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    /* opacity: 0.4; */
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
    width: 322px;
    height: 138px;
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
    min-height: 400px;
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

.roles{
  width: 100%;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(2, 1fr);
  justify-content: space-between;
  justify-items: center;
}

</style>

<style>
/* .v-field__field{
    padding-left: 20px;
}

.v-field__input{
} */
</style>
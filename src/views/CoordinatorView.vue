<template>
    <div class="wrapper">
        <div style="display: flex; flex-direction: column; align-items: center;" v-if="step=='check'">
            <spinner-component/>

            <div class="mt-5" v-if="examsEmpty">
                <v-icon size="18" color="error">mdi-cancel</v-icon>
                <span style="color: var(--red-color)" class="ml-1">{{ currentLang.coordinatorView[0] }}</span>
            </div>
        </div>

        <div class="exams" v-if="step=='choise-exam'">
            <exam-card
            v-for="exam in userExams"
            :key="exam.id"
            :exam="exam"
            :diniedExam="diniedExam"
            :launchPrepareProcess="launchPrepareProcess"
            :autoStartTest="autoStartTest"
            />
        </div>

        <div class="prepare" v-if="step=='prepare'">
            <spinner-component/>
        </div>

        <div class="exam-dinied d-flex align-center" v-if="examDinied.status">
            <div class="d-flex align-center ml-10">
                <v-icon>mdi-cancel</v-icon>
                <span class="ml-1">{{ examDinied.msg }}</span>
            </div>
        </div>

        
        <div style="position: absolute; bottom: 0; right: 0; z-index: 777; padding: 2px 20px; display: flex; gap: 30px">
            <div class="d-flex align-center">
                <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                    <div style="cursor: help" v-bind="props" class="d-flex align-center">
                        <v-icon size="20" color="var(--main-color)">mdi-alarm</v-icon>
                        <span class="ml-1">{{ formatTime(exitTimer) }}</span>
                    </div>
                </template>
                <span>{{ currentLang.coordinatorView[36] }}</span>
                </v-tooltip>
            </div>

            <v-btn
            icon
            v-bind="props"
            color="var(--red-color)"
            density="comfortable"
            @click="exitToAuth()"
            >
                <v-icon
                size="18"
                color="white"
                >mdi-exit-to-app</v-icon>
            </v-btn>
        </div>

        <div style="position: absolute; top: 0; left: 0; z-index: 777; padding:10px 20px; width: 100%">
            <div class="d-flex align-center mt-2 w-full">
                <v-icon size="20" color="var(--main-color)">mdi-account</v-icon>
                <span class="ml-2" style="color: #555; width: 100%">

                    <span v-if="getUserData.userData.userRole == 'student'">
                        <span v-if="currentLang.language == 'ru'">{{ getUserData.userData.roleProperties.educationForm == 'full-time' ? currentLang.examView[62] : getUserData.userData.roleProperties.educationForm == 'in-absentia' ? currentLang.examView[63] : getUserData.userData.roleProperties.educationForm == 'magistracy' ? currentLang.examView[64] : 'unknown' }} {{ getCourse(+getUserData.userData.roleProperties.recieptDate) }}-{{ currentLang.examView[65] }}  {{ getCourse(+getUserData.userData.roleProperties.recieptDate) }}{{ getUserData.userData.roleProperties.group < 10 ? `0${getUserData.userData.roleProperties.group}` : getUserData.userData.roleProperties.group }}-{{ currentLang.examView[66] }} </span>
                        <span v-if="currentLang.language == 'uz_l'">{{ getCourse(+getUserData.userData.roleProperties.recieptDate) }}-{{ currentLang.examView[65] }}  {{ getCourse(+getUserData.userData.roleProperties.recieptDate) }}{{ getUserData.userData.roleProperties.group < 10 ? `0${getUserData.userData.roleProperties.group}` : getUserData.userData.roleProperties.group }}-{{ currentLang.examView[66] }} {{ getUserData.userData.roleProperties.educationForm == 'full-time' ? currentLang.examView[62] : getUserData.userData.roleProperties.educationForm == 'in-absentia' ? currentLang.examView[63] : getUserData.userData.roleProperties.educationForm == 'magistracy' ? currentLang.examView[64] : 'unknown' }} </span>
                    </span>
                    <span v-if="getUserData.userData.userRole == 'enrollee'">
                        <span v-if="currentLang.language == 'ru'">{{ currentLang.examView[68] }} {{ getUserData.userData.roleProperties.group }}-{{ currentLang.examView[66] }} ({{ getUserData.userData.roleProperties.admissionYear }}, {{ getUserData.userData.roleProperties.educationForm == 'full-time' ? currentLang.examView[34] : getUserData.userData.roleProperties.educationForm == 'in-absentia' ? currentLang.examView[35] : getUserData.userData.roleProperties.educationForm == 'magistracy' ? currentLang.examView[36] : 'unknown' }})</span>
                        <span v-if="currentLang.language == 'uz_l'">
                            {{ getUserData.userData.roleProperties.group }}-{{ currentLang.examView[66] }} {{ currentLang.examView[68] }} ({{ getUserData.userData.roleProperties.admissionYear }}, {{ getUserData.userData.roleProperties.educationForm == 'full-time' ? currentLang.examView[34] : getUserData.userData.roleProperties.educationForm == 'in-absentia' ? currentLang.examView[35] : getUserData.userData.roleProperties.educationForm == 'magistracy' ? currentLang.examView[36] : 'unknown' }})
                        </span>
                    </span>
                    <span v-if="getUserData.userData.userRole == 'teacher'">
                        <span v-if="currentLang.language == 'ru'">{{ currentLang.examView[69] }} {{ currentLang.examView[71] }} "{{ getDepartment(getUserData.userData.roleProperties.department) }}"</span>
                        <span v-if="currentLang.language == 'uz_l'">"{{ getDepartment(getUserData.userData.roleProperties.department) }}" {{ currentLang.examView[71] }} {{ currentLang.examView[69] }}</span>
                    </span>
                    <span v-if="getUserData.userData.userRole == 'employee'">
                        <span v-if="currentLang.language == 'ru'">{{ currentLang.examView[70] }} {{ currentLang.examView[72] }} "{{ getDepartment(getUserData.userData.roleProperties.department) }}"</span>
                        <span v-if="currentLang.language == 'uz_l'">"{{ getDepartment(getUserData.userData.roleProperties.department) }}" {{ currentLang.examView[72] }} {{ currentLang.examView[70] }}</span>
                    </span>

                    <span style="margin-left: 5px; font-weight: bold;">{{ `${getUserData.userData.bio.firstName ? getUserData.userData.bio.firstName : ''} ${getUserData.userData.bio.lastName ? getUserData.userData.bio.lastName : ''} ${getUserData.userData.bio.patronymic ? getUserData.userData.bio.patronymic : ''}` }}</span>
                    <span style="margin-left: 5px;">({{ getUserData.authData.login }})</span>
                </span>
            </div>  
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import SpinnerComponent from '@/components/SpinnerComponent'
import ExamCard from '@/components/coordinator/ExamCard.vue'
import makeReq from '@/utils/makeReq';
import { socket } from '@/socket';

export default {
    data(){
        return {
            step: undefined,
            examDinied: {
                status: false,
                msg: undefined
            },
            diniedExamTimeout: undefined,
            examsEmpty: false,

            autoStartTest: undefined,
            userExams: [],
            
            exitTimer: 60,
            exitTimerInterval: undefined
        }
    },
    computed: mapGetters(['getUserData', 'getInitializationProcess', 'getAdminServerIP', 'getExams', 'getSubjects', 'getCurrentTickets', 'currentLang', 'getExamsStatusUpdating', 'getExamsListNeedToUpdating', 'getAuthState', 'getHelperServerIP', 'getDepartments']),
    watch: {
        getExamsStatusUpdating(){
            this.sortExamsList()
        },

        async getExamsListNeedToUpdating(){
            const examsData = await this.getExamsList()

            if(examsData){
                if(examsData.data.userExams.length){
                    const examsList = []
                    examsData.data.userExams.forEach(ue =>{
                        if(ue!==null){
                            examsList.push(ue)
                        }
                    })

                    if(examsList.length){
                        this.setExams(examsList)
                        this.sortExamsList()
                    } else {
                        this.logout()
                        }
                } else {
                    this.logout()
                }
            }
        },

        step(){
            if(this.step == 'choise-exam'){
                // start exit timer
                this.exitTimerInterval = setInterval(()=>{
                    if(this.exitTimer!=0) this.exitTimer-=1
                    else {
                        clearInterval(this.exitTimerInterval)
                        this.exitToAuth()
                    }
                }, 1000)
            }
        }
    },
    methods:{
        ...mapMutations(['setUserData', 'setExams', 'setAuthState', 'setExamToken', 'updExamUserStatus']),

        exitToAuth(){
            this.setExams([])
            this.setUserData(undefined)
            this.setAuthState(false)
            this.setExamToken(undefined)
            this.$router.push('/auth')
        },
        
        formatTime(time) {
            const minutes = Math.floor(time / 60)
            let seconds = time % 60

            if (seconds < 10) {
                seconds = `0${seconds}`
            }

            return `${minutes}:${seconds}`
        },

        getCourse(year){
            year = +year
            let nextEducationYear = false
            let currentYear = new Date().getFullYear()
            if(new Date().getMonth()>8){
                nextEducationYear = true
            }

            if(nextEducationYear && currentYear-year!=3){
                return (currentYear-year)+1
            }
            return currentYear-year
        },
        
        getDepartment(department){
            const departmentName= this.getDepartments.find(item => item.id == department) || 'unknown'
            return departmentName.name.ru || departmentName.id
        },

        sortExamsList(){
            this.userExams = []

            this.getExams.map( exam => {
                if(exam.examDateParams.start.byCommand && exam.examDateParams.end.byCommand){
                    if(exam.hasBegun) this.userExams.push(exam)
                }
            })
            
            if(this.userExams.length == 1) {
                if(this.getAuthState) this.autoStartTest = this.userExams[0].id
            } else if(this.userExams.length == 0){
                this.logout()
            }
            if(this.userExams.length == 0){
                this.logout()
            }
        },

        diniedExam(msg){
            clearTimeout(this.diniedExamTimeout)
            this.diniedExamTimeout = undefined

            this.examDinied.msg = msg
            this.examDinied.status = true


            this.diniedExamTimeout = setTimeout(()=>{
                this.examDinied.status = false
            }, 3000)
        },

        launchPrepareProcess(){
            this.step = 'prepare'

            setTimeout(()=>{
                this.$router.push('/prepare')
            },1000)
        },

        logout(){
            this.step = 'check'
            this.examsEmpty = true

            setTimeout(()=>{
                this.setUserData(undefined)
                this.setAuthState(false)
                // Экзаменов вообще нет
                this.$router.push('/auth')
            },3000)
        },

        async getExamsList(){
            try {
                const examsData = await makeReq(`${this.getHelperServerIP}/api/exams/check`, 'POST', {
                    auth: {
                        id: this.getUserData.authData.id,
                        token: this.getUserData.authData.token.key
                    }
                })

                return examsData
            } catch (error) {
                console.error(error)
            }
        }
    },
    async mounted(){
        if(!this.getInitializationProcess){
            this.$router.push('/')
        }
        if(!this.getUserData){
            this.$router.push('/auth')
        } else {            

            if(!this.getCurrentTickets){
                this.step = 'check'
            } else {
                this.launchPrepareProcess()
            }
            console.log(this.getUserData);
            
            const examsData = await this.getExamsList()

            if(examsData){
                console.log(examsData);
                if(examsData.statusCode==200){
                    this.step = 'choise-exam'

                    if(examsData.data.userExams.length){
                        const examsList = []
                        examsData.data.userExams.forEach(ue =>{
                            if(ue!==null){
                                examsList.push(ue)
                            }
                        })

                        if(examsList.length){
                            this.setExams(examsList)
                            this.sortExamsList()
                        } else {
                            this.logout()
                        }
                    } else {
                        this.logout()
                    }

                } else if(examsData.statusCode==204){
                    this.examsEmpty = true

                    setTimeout(()=>{
                        localStorage.removeItem('userData')
                        this.setUserData(undefined)
                        this.setAuthState(false)
                        // Экзаменов вообще нет
                        this.$router.push('/auth')
                    },3000)
                }
            }

        }

        socket.on(`client-reset-${this.getUserData.authData.id}`, (data)=>{
            this.updExamUserStatus({ id: data.examID, status: 'waiting' })
            this.setExamToken(data.token)
        })
        socket.on(`client-stop-${this.getUserData.authData.id}`, (data)=>{
            this.updExamUserStatus({ id: data.examID, status: 'blocked' })
        })
    },
    unmounted(){
      if(this.exitTimerInterval){
        clearInterval(this.exitTimerInterval)
      }
    },
    components:{
        SpinnerComponent,
        ExamCard
    }
}
</script>

<style scoped>
.wrapper{
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.exams{
    width: 70%;
    height: 100%;
    display: flex;
    gap: 50px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin: 100px 0;
}

.exam-dinied{
    position: fixed;
    width: 100%;
    height: 40px;
    background-color: var(--red-color);
    bottom: 0;
    left: 0;
    padding: 0 20px;
    color: #fff;
}
</style>
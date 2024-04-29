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

        
        <div style="position: absolute; bottom: 0; right: 0; z-index: 777; padding: 2px 20px">
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
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import SpinnerComponent from '@/components/SpinnerComponent'
import ExamCard from '@/components/coordinator/ExamCard.vue'
import makeReq from '@/utils/makeReq';

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
            userExams: []
        }
    },
    computed: mapGetters(['getUserData', 'getInitializationProcess', 'getAdminServerIP', 'getExams', 'getSubjects', 'getCurrentTickets', 'currentLang', 'getExamsStatusUpdating', 'getExamsListNeedToUpdating', 'getAuthState', 'getHelperServerIP']),
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
        }
    },
    methods:{
        ...mapMutations(['setUserData', 'setExams', 'setAuthState', 'setExamToken']),

        exitToAuth(){
            this.setExams([])
            this.setUserData(undefined)
            this.setAuthState(false)
            this.setExamToken(undefined)
            this.$router.push('/auth')
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
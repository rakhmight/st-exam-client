<template>
    <div class="wrapper">
        <div style="display: flex; flex-direction: column; align-items: center;" v-if="step=='check'">
            <spinner-component/>

            <div class="mt-5" v-if="examsEmpty">
                <v-icon size="18" color="error">mdi-cancel</v-icon>
                <span style="color: var(--red-color)" class="ml-1">У вас нет активных экзаменов</span>
            </div>
        </div>

        <div class="exams" v-if="step=='choise-exam'">
            <exam-card
            v-for="(exam, i) in getExams"
            :key="i"
            :exam="exam"
            :diniedExam="diniedExam"
            :launchPrepareProcess="launchPrepareProcess"
            />
        </div>

        <div class="prepare" v-if="step=='prepare'">
            <spinner-component/>
        </div>

        <div class="exam-dinied d-flex align-center" v-if="examDinied.status">
            <div class="d-flex align-center">
                <v-icon>mdi-cancel</v-icon>
                <span class="ml-1">{{ examDinied.msg }}</span>
            </div>
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
            examsEmpty: false
        }
    },
    computed: mapGetters(['getUserData', 'getInitializationProcess', 'getAdminServerIP', 'getExams', 'getSubjects', 'getCurrentTickets']),
    methods:{
        ...mapMutations(['setUserData', 'setExams', 'setAuthState']),

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
            
            // Проверка на есть ли у пользователя активные экзамены
            await makeReq(`${this.getAdminServerIP}/api/exams/check`, 'POST', {
                auth: {
                    id: this.getUserData.authData.id,
                    token: this.getUserData.authData.token.key
                }
            })
            .then((data)=>{
                console.log(data);
                if(data.statusCode==200){
                    this.step = 'choise-exam'

                    if(data.data.userExams.length){
                        const userExams = []
                        data.data.userExams.forEach(ue =>{
                            if(ue!==null){
                                userExams.push(ue)
                            }
                        })

                        if(userExams.length){
                            this.setExams(userExams)
                            console.log(this.getExams);
                        } else {
                            this.logout()
                        }
                    } else {
                        this.logout()
                    }

                } else if(data.statusCode==204){
                    this.examsEmpty = true

                    setTimeout(()=>{
                        localStorage.removeItem('userData')
                        this.setUserData(undefined)
                        this.setAuthState(false)
                        // Экзаменов вообще нет
                        this.$router.push('/auth')
                    },3000)
                }
            })
            .catch((error)=>{
                // Здесь экран ошибки
                console.error(error)
            })

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
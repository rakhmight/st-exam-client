<template>
    <div class="card">
        <div class="card__header d-flex justify-center">
            <v-tooltip>
                <template v-slot:activator="{ props }">
                    <!-- <v-icon size="70" color="var(--special-color)" v-if="exam.complex.length==1" v-bind="props">mdi-format-list-checkbox</v-icon> -->
                    <div style="width: 60px" v-if="!this.exam.isComplex" class="mt-2">
                        <v-img src="@/assets/media/exam.png" v-bind="props"></v-img>
                    </div>
                </template>
                <span>{{ currentLang.coordinatorView[1] }}</span>
            </v-tooltip>
            
            <v-tooltip>
                <template v-slot:activator="{ props }">
                    <div style="width: 60px" v-if="this.exam.isComplex" class="mt-2">
                        <v-img src="@/assets/media/complex.png" v-bind="props"></v-img>
                    </div>
                    <!-- <v-icon size="70" color="var(--special-color)" v-if="exam.complex.length>1" v-bind="props">mdi-format-list-text</v-icon> -->
                </template>
                <span>{{ currentLang.coordinatorView[2] }}</span>
            </v-tooltip>

            <!-- <div class="timer">
            <v-tooltip>
                <template v-slot:activator="{ props }">
                    <span v-bind="props" style="color: #888; font-size: 0.9em; cursor: help;">120:22</span>
                </template>
                <span>Countdown to the start of the exam</span>
            </v-tooltip>
            </div> -->

            <div class="saving" v-if="exam.userAttempts">
            <v-tooltip>
                <template v-slot:activator="{ props }">
                    <div v-bind="props" style="cursor: help;">
                        <v-icon size="25" color="var(--special-color)">mdi-content-save</v-icon>
                    </div>
                </template>
                <span>{{ currentLang.coordinatorView[3] }}</span>
            </v-tooltip>
            </div>
        </div>

        <div class="card__content">
            <table v-if="exam.complex.length==1">
                <tr>
                    <td>
                        <div class="d-flex align-center">
                            <v-icon size="18" color="var(--main-color)">mdi-alpha-s-box-outline</v-icon>
                            <span class="ml-1">{{ currentLang.coordinatorView[4] }}:</span>
                        </div>
                    </td>
                    <td>
                        <v-tooltip text="Tooltip">
                            <template v-slot:activator="{ props }">                                
                                <div class="min-ctx" style="cursor: help;" v-bind="props">{{ getSubjectName(exam.complex[0].subject) }}</div>
                            </template>
                            <span>{{ getSubjectName(exam.complex[0].subject) }}</span>
                        </v-tooltip>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex align-center">
                            <v-icon size="18" color="var(--main-color)">mdi-alarm</v-icon>
                            <span class="ml-1">{{ currentLang.coordinatorView[5] }}:</span>
                        </div>
                    </td>
                    <td><div class="min-ctx">{{ exam.complex[0].params.examTime===null ? 'unlimit' : exam.complex[0].params.examTime }}</div></td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex align-center">
                            <v-icon size="18" color="var(--main-color)">mdi-help-circle-outline</v-icon>
                            <span class="ml-1">{{ currentLang.coordinatorView[6] }}:</span>
                        </div>
                    </td>
                    <td><div class="min-ctx">{{ exam.complex[0].params.questionsCount }}</div></td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex align-center">
                            <v-icon size="18" color="var(--main-color)">mdi-clock-time-eight-outline</v-icon>
                            <span class="ml-1">{{ currentLang.coordinatorView[7] }}:</span>
                        </div>
                    </td>
                    <td><div class="ctx">{{ exam.examDateParams.start.byCommand ? 'by administrator' : getExamDate(exam.examDateParams.start.date, exam.examDateParams.start.time) }}</div></td>
                </tr>
            </table>

            
            <table v-if="exam.complex.length>1">
                <tr
                v-for="(subject, i) in getSubjectsNames()"
                :key="i"
                >
                    <td>
                        <div class="d-flex align-center" v-if="i==0">
                            <v-icon size="18" color="var(--main-color)">mdi-alpha-s-box-outline</v-icon>
                            <span class="ml-1">{{ currentLang.coordinatorView[8] }}:</span>
                        </div>
                    </td>
                    <td>
                        <v-tooltip text="Tooltip">
                            <template v-slot:activator="{ props }">                                
                                <div class="min-ctx" v-bind="props">{{ subject }}</div>
                            </template>
                            <span>{{ subject }}</span>
                        </v-tooltip>
                    </td>
                </tr>

                <tr style="opacity: 0" v-if="exam.complex.length == 2">
                    <td>aggregate</td>
                    <td>aggregate</td>
                </tr>

                <tr style="opacity: 0" v-if="exam.complex.length == 1">
                    <td>aggregate</td>
                    <td>aggregate</td>
                </tr>
                
                <tr>
                    <td>
                        <div class="d-flex align-center">
                            <v-icon size="18" color="var(--main-color)">mdi-clock-time-eight-outline</v-icon>
                            <span class="ml-1">{{ currentLang.coordinatorView[9] }}:</span>
                        </div>
                    </td>
                    <td><div class="ctx">{{ exam.examDateParams.start.byCommand ? currentLang.coordinatorView[10] : getExamDate(exam.examDateParams.start.date, exam.examDateParams.start.time) }}</div></td>
                </tr>
            </table>
        </div>
        
        <div class="card__footer">
            <div>
                <v-dialog
                v-model="dialog"
                width="50%"
                >
                <template v-slot:activator="{ props: menu  }">
                    <v-tooltip location="bottom">
                        <template v-slot:activator="{ props: tooltip }">
                            <v-icon size="22" color="var(--main-color)" v-bind="mergeProps(menu, tooltip)">mdi-information-outline</v-icon>
                        </template>
                        <span>{{ currentLang.coordinatorView[11] }}</span>
                    </v-tooltip>
                </template>

                <v-card>
                    <div class="dialog__header">
                        <div class="d-flex align-center justify-space-between">
                            <div class="d-flex align-center">
                                <v-icon size="23" color="var(--main-color)">mdi-information-outline</v-icon>
                                <span class="text-h6 ml-1" v-if="exam.complex.length==1">{{ currentLang.coordinatorView[12] }}</span>
                                <span class="text-h6 ml-1" v-if="exam.complex.length>1">{{ currentLang.coordinatorView[13] }}</span>
                            </div>
                            <div>
                                <v-icon @click="dialog=false" color="var(--red-color)">mdi-window-close</v-icon>
                            </div>
                        </div>
                        <div></div>
                    </div>

                    <v-divider></v-divider>

                    <div class="dialog__content">
                        <div class="dialog__main-info">
                            <table width="100%">
                                <tr>
                                    <td>
                                        <div class="d-flex align-center">
                                            <v-icon size="18" color="var(--main-color)">mdi-clock-outline</v-icon>
                                            <span class="ml-1">{{ currentLang.coordinatorView[14] }}:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="ctx">{{ exam.examDateParams.start.byCommand ? currentLang.coordinatorView[10] : getExamDate(exam.examDateParams.start.date, exam.examDateParams.start.time) }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex align-center">
                                            <v-icon size="18" color="var(--main-color)">mdi-clock-outline</v-icon>
                                            <span class="ml-1">{{ currentLang.coordinatorView[15] }}:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="ctx">{{ exam.examDateParams.end.byCommand ? currentLang.coordinatorView[10] : getExamDate(exam.examDateParams.end.date, exam.examDateParams.end.time) }}</div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        
                        <div class="exams mt-3 d-flex flex-column" style="gap: 20px">
                            <div
                            v-for="(object, i) in exam.complex"
                            :key="i"
                            class="dialog__exam"
                            >
                                <div class="d-flex justify-space-between align-start">
                                    <div class="d-flex align-center">
                                        <v-icon size="20" color="var(--special-color)" v-if="i==0">mdi-numeric-1-circle</v-icon>
                                        <v-icon size="20" color="var(--special-color)" v-if="i==1">mdi-numeric-2-circle</v-icon>
                                        <v-icon size="20" color="var(--special-color)" v-if="i==2">mdi-numeric-3-circle</v-icon>
                                        <v-icon size="20" color="var(--special-color)" v-if="i==3">mdi-numeric-4-circle</v-icon>
                                        <v-icon size="20" color="var(--special-color)" v-if="i==4">mdi-numeric-5-circle</v-icon>
                                        <v-icon size="20" color="var(--special-color)" v-if="i==5">mdi-numeric-6-circle</v-icon>
                                        <v-icon size="20" color="var(--special-color)" v-if="i==6">mdi-numeric-7-circle</v-icon>
                                        <v-icon size="20" color="var(--special-color)" v-if="i==7">mdi-numeric-8-circle</v-icon>
                                        <v-icon size="20" color="var(--special-color)" v-if="i==8">mdi-numeric-9-circle</v-icon>
                                        <v-icon size="20" color="var(--special-color)" v-if="i==9">mdi-numeric-10-circle</v-icon>
                                        <span class="ml-1"><span style="color: var(--special-color); font-weight: 700;">{{ currentLang.coordinatorView[1] }}.</span> {{ currentLang.coordinatorView[16] }}:</span>
                                    </div>
                                    <div style="width:60%">
                                        <span class="ml-1" style="color: var(--main-color)">{{ getSubjectName(object.subject) }}</span>
                                    </div>
                                </div>

                                <v-divider class="mt-1 mb-1" color="var(--special-color)"></v-divider>

                                <table>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-center">
                                                <v-icon size="18" color="var(--main-color)">mdi-ticket-confirmation-outline</v-icon>
                                                <span class="ml-1">{{ currentLang.coordinatorView[17] }}:</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="ctx">{{ object.params.ticketsCount }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-center">
                                                <v-icon size="18" color="var(--main-color)">mdi-help-circle-outline</v-icon>
                                                <span class="ml-1">{{ currentLang.coordinatorView[18] }}:</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="ctx">{{ object.params.questionsCount }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-center">
                                                <v-icon size="18" color="var(--main-color)">mdi-alarm</v-icon>
                                                <span class="ml-1">{{ currentLang.coordinatorView[19] }}:</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="ctx">{{ object.params.examTime==null ? currentLang.coordinatorView[28] : `${object.params.examTime} ${currentLang.coordinatorView[29]}` }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-center">
                                                <v-icon size="18" color="var(--main-color)">mdi-alpha-t-box-outline</v-icon>
                                                <span class="ml-1">{{ currentLang.coordinatorView[20] }}:</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="ctx">{{ getThemesName(object.subject, object.themes) }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-center">
                                                <v-icon size="18" color="var(--main-color)">mdi-alarm</v-icon>
                                                <span class="ml-1">{{ currentLang.coordinatorView[21] }}:</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="ctx">{{ object.params.questionTime==null ? currentLang.coordinatorView[28] : `${object.params.questionTime} ${currentLang.coordinatorView[29]}` }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-center">
                                                <v-icon size="18" color="var(--main-color)">mdi-translate</v-icon>
                                                <span class="ml-1">{{ currentLang.coordinatorView[22] }}:</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="ctx">{{ getLanguagesName(object.params.languages) }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-center">
                                                <v-icon size="18" color="var(--main-color)">mdi-cursor-default-click-outline</v-icon>
                                                <span class="ml-1">{{ currentLang.coordinatorView[23] }}:</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="ctx">                                                
                                                <v-icon size="20" v-if="object.params.changeAnswerPossibility">mdi-check-circle-outline</v-icon>
                                                <v-icon size="20" color="var(--red-color)" v-else>mdi-close-circle-outline</v-icon>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td>
                                            <div class="d-flex align-center">
                                                <v-icon size="18" color="var(--main-color)">mdi-star</v-icon>
                                                <span class="ml-1">{{ currentLang.coordinatorView[24] }}:</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex justify-center">
                                                <table width="100%">
                                                    <tr>
                                                        <td>
                                                            <span style="font-weight: 600; color: var(--special-color)">"5"</span> <span style="color: #888">({{ currentLang.coordinatorView[25] }})</span>
                                                        </td>
                                                        <td>{{ `${object.params.evaluationSystem.great.from}-${object.params.evaluationSystem.great.to} %` }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span style="font-weight: 600; color: var(--special-color)">"4"</span> <span style="color: #888">({{ currentLang.coordinatorView[26] }})</span>
                                                        </td>
                                                        <td>{{ `${object.params.evaluationSystem.good.from}-${object.params.evaluationSystem.good.to} %` }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span style="font-weight: 600; color: var(--special-color)">"3"</span> <span style="color: #888">({{ currentLang.coordinatorView[27] }})</span>
                                                        </td>
                                                        <td>{{ `${object.params.evaluationSystem.satisfactorily.from}-${object.params.evaluationSystem.satisfactorily.to} %` }}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </v-card>
                </v-dialog>
            </div>

            <div>
                <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-icon size="22" color="var(--main-color)" v-bind="props" style="cursor: pointer" @click="beginExam()">mdi-play-circle-outline</v-icon>
                    </template>
                    <span>{{ currentLang.coordinatorView[30] }}</span>
                </v-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import { getSubject, getThemes, getLanguages, normalizeDate } from '@/utils/getInfo';
import { mergeProps } from 'vue'
import { mapGetters, mapMutations } from 'vuex';
import makeReq from '@/utils/makeReq';

export default {
    props:{
        exam: Object,
        diniedExam: Function,
        launchPrepareProcess: Function,
        autoStartTest: undefined || String
    },
    data(){
        return {
            dialog: false
        }
    },
    computed: mapGetters(['getSubjects', 'getAdminServerIP', 'getUserData', 'getExamServerIP', 'getCurrentTickets', 'getExams', 'currentLang']),
    watch: {
        autoStartTest(){
            this.checkAutoTest()
        }
    },
    methods:{
        mergeProps,
        ...mapMutations(['setCurrentTickets', 'setCurrentExamID', 'setExamToken']),

        checkAutoTest(){
            if(this.autoStartTest == this.exam.id){
                console.log('Auto test starting');
                this.beginExam()
            }
        },

        getSubjectsNames(){
            const subjects = []

            this.exam.complex.forEach(exam => {
                if(subjects.length<3){
                    subjects.push(getSubject(exam.subject, this.getSubjects))
                }

                if(subjects.length==2 && this.exam.complex.length>2){
                    subjects.push(this.currentLang.coordinatorView[31])
                }
            });

            return subjects
        },

        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },

        getThemesName(subject, themes){
            return getThemes(subject, themes, this.getSubjects)
        },

        getLanguagesName(langs){
            return getLanguages(langs)
        },

        getExamDate(date, time){
            const fullDate = new Date(normalizeDate(date, time))
            return `${fullDate.getDate()<10 ? `0${fullDate.getDate()}` : fullDate.getDate()}.${fullDate.getMonth()+1<10 ? `0${fullDate.getMonth()+1}` : fullDate.getMonth()+1}.${fullDate.getFullYear()} ${fullDate.getHours()<10 ? `0${fullDate.getHours()}` : fullDate.getHours()}:${fullDate.getMinutes()<10 ? `0${fullDate.getMinutes()}` : fullDate.getMinutes()}`
        },

        async beginExam(){
            const tickets = []
            
            const currentExam = this.getExams.find(ex => ex.id==this.exam.id)
            if(currentExam && currentExam.userAttempts){
                const ticketsFA = currentExam.userAttempts.map(attempt=>{
                    // console.log(attempt);
                    return {
                        subject: attempt.subject,
                        ticket: attempt.attempts.ticket
                    }
                })

                tickets.push(...ticketsFA)
            }

            // console.log(tickets);

            if(!this.getCurrentTickets){
                await makeReq(`${this.getAdminServerIP}/api/exams/init`, 'POST', {
                    auth:{
                        id: this.getUserData.authData.id,
                        token: this.getUserData.authData.token.key,
                    },
                    data:{
                        examID: this.exam.id
                    }
                })
                .then(async (data)=>{
                    if(data.statusCode == 200){
                        const token = data.data.token

                        this.setExamToken(token)

                        await makeReq(`${this.getExamServerIP}/api/exam/begin`, 'POST', {
                            auth: {
                                id: this.getUserData.authData.id,
                                token,
                            },
                            exam: {
                                examID: this.exam.id,
                                options: this.exam,
                                tickets: tickets
                            }
                        })
                        .then((data)=>{
                            console.log(data);
                            if(data.statusCode == 403){
                                this.diniedExam(data.message)
                            } else {
                                this.setCurrentTickets(data.data.tickets)
                                console.log(this.getCurrentTickets);
                                this.setCurrentExamID(this.exam.id)
                                this.launchPrepareProcess()
                            }
                        })
                        .catch(error=>{
                            console.error(error)
                            return
                        })
                    } else if(data.statusCode == 403){
                        if(data.data.cause == 'finished'){
                            this.diniedExam(this.currentLang.coordinatorView[32])
                        } else if(data.data.cause == 'not began'){
                            this.diniedExam(this.currentLang.coordinatorView[33])
                        } else if(data.data.cause == 'already began'){
                            this.diniedExam(this.currentLang.coordinatorView[34])
                        }
                    }
                    console.log(data);
                })
                .catch(error=>{
                    console.error(error)
                    return
                })
            }
        }
    },
    mounted(){
        //console.log(this.exam);
        this.checkAutoTest()
    }
}
</script>


<style scoped>

::-webkit-scrollbar {
    width: 6px; /* ширина для вертикального скролла */
    background-color: #b9b9b9;
    display: block;
}

/* ползунок скроллбара */
::-webkit-scrollbar-thumb {
    background-color: #0d5ace9a;
    border-radius: 1em;
}
.card{
    width: 250px;
    height: 230px;
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    padding: 5px 0 0 0;
}
.card__header{
    position: relative;
}
.timer{
    position: absolute;
    right: 10px;
}
.saving{
    position: absolute;
    left: 10px;
}
.card__content{
    flex: 1 1 auto;
    padding: 0 10px;
    margin-top: 10px;
}
.card__content>table{
    width: 100%;
    font-size: 0.95em
}
.min-ctx{
    width: 115px;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--main-color);
    text-align: right;
}

.ctx{
    color: var(--main-color);
    text-align: right;
}

.card__footer{
    background-color: rgba(0, 0, 0, 0.227);
    height: 35px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    justify-content: space-between;
}

.dialog__header{
    padding: 10px 20px;
}

.dialog__content{
    padding: 10px 20px;
    max-height: 600px;
    overflow-y: auto;
}

.dialog__exam>table>tr>td:nth-child(2){
    width: 60%;
}
.dialog__exam>table>tr>td{
    vertical-align: top;
}
.dialog__exam>table{
    width: 100%;
}
</style>

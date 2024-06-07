<template>
    <div class="sidebar">
        <div class="d-flex flex-column" style="gap: 30px">
            <div class="map">
                <div class="map__title">
                    <div class="d-flex align-center mb-1">
                        <v-icon size="18">mdi-format-list-bulleted</v-icon>
                        <span class="ml-1" style="font-size: 1.1em; font-weight: 300;">{{ currentLang.examView[37] }}</span>
                    </div>
                    <v-divider></v-divider>
                </div>
                <div class="map__table">
                    <v-table
                    density="compact"
                    >
                        <thead style="background-color: #ffffff0d">
                        <tr>
                            <th style="width: 25px;padding: 0 7px;"></th>
                            <th class="text-left" style="width: 30px; color: #dcdcdcd0;padding: 0 7px;">№</th>
                            <th class="text-left" style="color: #dcdcdcd0; font-weight: 300;padding: 0 7px;">{{ currentLang.examView[38] }}</th>
                        </tr>
                        </thead>
                    </v-table>
                    <div class="table-body">
                    <v-table
                    density="compact"
                    v-if="step=='exam'"
                    >
                        <tbody>
                        <tr
                        v-for="(question, i) in ticket.questions"
                        :key="question.id"
                        :style="currentQuestion==question.id ? 'background-color: #ffffff21': ''"
                        @click="changeCurrentQuestion(question.id)"
                        :class="`map-${question.id}`"
                        class="map-item"
                        >
                            <td style="width: 25px; max-width: 25px;color: #fff;padding: 0 7px;font-weight: 300;overflow: hidden;cursor: pointer;" v-if="answeredQuestions.indexOf(question.id)==-1">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" v-if="question.type=='basic-question'" size="18" :color="question.id==currentQuestion ? '#64b0ff' : ''">mdi-text</v-icon>
                                    </template>
                                    <span>{{ currentLang.examView[39] }}</span>
                                </v-tooltip>
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" v-if="question.type=='question-with-images'" size="18" :color="question.id==currentQuestion ? '#64b0ff' : ''">mdi-image-outline</v-icon>
                                    </template>
                                    <span>{{ currentLang.examView[40] }}</span>
                                </v-tooltip>
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" v-if="question.type=='question-with-field'" size="18" :color="question.id==currentQuestion ? '#64b0ff' : ''">mdi-selection-ellipse-arrow-inside</v-icon>
                                    </template>
                                    <span>{{ currentLang.examView[41] }}</span>
                                </v-tooltip>
                            </td>
                            <td style="width: 25px; max-width: 25px;color: #fff;padding: 0 7px;font-weight: 300;overflow: hidden;cursor: pointer;" v-if="answeredQuestions.indexOf(question.id)!=-1">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon size="18" color="#64b0ff" v-bind="props">mdi-check-circle-outline</v-icon>
                                    </template>
                                    <span>{{ currentLang.examView[42] }}</span>
                                </v-tooltip>
                            </td>
                            <td style="width: 25px; max-width: 30px;color: #fff;padding: 0 7px;font-weight: 300;overflow: hidden;cursor: pointer;">{{ i+1 }}</td>
                            <td style="max-width: 90px;overflow-x: hidden;white-space: nowrap;text-overflow: ellipsis;color: #fff;padding: 0 7px;font-weight: 300;overflow: hidden;cursor: pointer;">
                                {{ getExamLanguage=='ru' ? question.context.questionCtx.ru : getExamLanguage=='eng' ? question.context.questionCtx.eng : getExamLanguage=='custom' ? question.context.questionCtx.custom : getExamLanguage=='uz_k' ? question.context.questionCtx.uz_k : question.context.questionCtx.uz_l }}
                            </td>
                        </tr>
                        </tbody>
                    </v-table>
                    </div>
                </div>
            </div>

            <div class="btns d-flex flex-column" style="gap:15px;">
                <!-- <v-btn
                density="compact"
                width="100%"
                color="#444"
                :disabled="blockActionBtns"
                >
                    <v-icon size="15">mdi-pause-circle-outline</v-icon>
                    <span class="ml-1" style="font-size: 0.9em;">Приостановить экзамен</span>
                </v-btn> -->

                <result-dialog
                :sendAnswers="sendAnswers"
                :blockActionBtns="blockActionBtns"
                :showResultDialog="showResultDialog"
                :exitExam="exitExam"
                :examResults="examResults"
                :answeredQuestions="answeredQuestions"
                :ticket="ticket"
                :timer="timer"
                :answers="answers"
                :startResultDialogTimer="startResultDialogTimer"
                />
            </div>
        </div>

        <div class="info" style="margin-bottom: 90px;">
            <div class="d-flex align-center">
                <v-icon size="18" color="#dcdcdcd0">mdi-information-outline</v-icon>
                <span class="ml-1" style="color: #dcdcdcd0">{{ currentLang.examView[43] }}:</span>
            </div>
            
            <v-tooltip>
                <template v-slot:activator="{ props }">
                    <div v-bind="props" style="cursor: help;max-width: 220px;overflow-x: hidden;white-space: nowrap;text-overflow: ellipsis;">
                        <span>{{ `${getUserData.userData.bio.firstName ? getUserData.userData.bio.firstName : ''} ${getUserData.userData.bio.lastName ? getUserData.userData.bio.lastName : ''} ${getUserData.userData.bio.patronymic ? getUserData.userData.bio.patronymic : ''}` }}</span>
                    </div>
                </template>
                <span>{{ `${getUserData.userData.bio.firstName ? getUserData.userData.bio.firstName : ''} ${getUserData.userData.bio.lastName ? getUserData.userData.bio.lastName : ''} ${getUserData.userData.bio.patronymic ? getUserData.userData.bio.patronymic : ''}` }}</span>
            </v-tooltip>
            
            <div class="" style="font-size: 0.9rem;">
                <div v-if="getUserData.userData.userRole == 'student'">
                        <span v-if="currentLang.language == 'ru'">{{ getUserData.userData.roleProperties.educationForm == 'full-time' ? currentLang.examView[62] : getUserData.userData.roleProperties.educationForm == 'in-absentia' ? currentLang.examView[63] : getUserData.userData.roleProperties.educationForm == 'magistracy' ? currentLang.examView[64] : 'unknown' }} {{ getCourse(+getUserData.userData.roleProperties.recieptDate) }}-{{ currentLang.examView[65] }}  {{ getCourse(+getUserData.userData.roleProperties.recieptDate) }}{{ getUserData.userData.roleProperties.group < 10 ? `0${getUserData.userData.roleProperties.group}` : getUserData.userData.roleProperties.group }}-{{ currentLang.examView[66] }}</span>
                        <span v-if="currentLang.language == 'uz_l'">{{ getCourse(+getUserData.userData.roleProperties.recieptDate) }}-{{ currentLang.examView[65] }}  {{ getCourse(+getUserData.userData.roleProperties.recieptDate) }}{{ getUserData.userData.roleProperties.group < 10 ? `0${getUserData.userData.roleProperties.group}` : getUserData.userData.roleProperties.group }}-{{ currentLang.examView[66] }} {{ getUserData.userData.roleProperties.educationForm == 'full-time' ? currentLang.examView[62] : getUserData.userData.roleProperties.educationForm == 'in-absentia' ? currentLang.examView[63] : getUserData.userData.roleProperties.educationForm == 'magistracy' ? currentLang.examView[64] : 'unknown' }}</span>
                </div>
                <div v-if="getUserData.userData.userRole == 'enrollee'">
                    <span v-if="currentLang.language == 'ru'">{{ currentLang.examView[68] }} {{ getUserData.userData.roleProperties.group }}-{{ currentLang.examView[66] }} ({{ getUserData.userData.roleProperties.admissionYear }}, {{ getUserData.userData.roleProperties.educationForm == 'full-time' ? currentLang.examView[34] : getUserData.userData.roleProperties.educationForm == 'in-absentia' ? currentLang.examView[35] : getUserData.userData.roleProperties.educationForm == 'magistracy' ? currentLang.examView[36] : 'unknown' }})</span>
                    <span v-if="currentLang.language == 'uz_l'">
                        {{ getUserData.userData.roleProperties.group }}-{{ currentLang.examView[66] }} {{ currentLang.examView[68] }} ({{ getUserData.userData.roleProperties.admissionYear }}, {{ getUserData.userData.roleProperties.educationForm == 'full-time' ? currentLang.examView[34] : getUserData.userData.roleProperties.educationForm == 'in-absentia' ? currentLang.examView[35] : getUserData.userData.roleProperties.educationForm == 'magistracy' ? currentLang.examView[36] : 'unknown' }})
                    </span>
                </div>
                <div v-if="getUserData.userData.userRole == 'teacher'">
                    <span v-if="currentLang.language == 'ru'">{{ currentLang.examView[69] }} {{ currentLang.examView[71] }} "{{ getDepartment(getUserData.userData.roleProperties.department) }}"</span>
                    <span v-if="currentLang.language == 'uz_l'">"{{ getDepartment(getUserData.userData.roleProperties.department) }}" {{ currentLang.examView[71] }} {{ currentLang.examView[69] }}</span>
                </div>
                <div v-if="getUserData.userData.userRole == 'employee'">
                    <span v-if="currentLang.language == 'ru'">{{ currentLang.examView[70] }} {{ currentLang.examView[72] }} "{{ getDepartment(getUserData.userData.roleProperties.department) }}"</span>
                    <span v-if="currentLang.language == 'uz_l'">"{{ getDepartment(getUserData.userData.roleProperties.department) }}" {{ currentLang.examView[72] }} {{ currentLang.examView[70] }}</span>
                </div>
            </div>

            <div class="mt-2">
                <p style="font-size: 1.2rem;">{{ currentLang.examView[67] }}: {{ getUserData.authData.login }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import ResultDialog from '@/components/exam/ResultDialog.vue'
import { mapGetters } from 'vuex';

export default {
    props:{
        ticket: Object,
        answers: Array,
        getExamLanguage: String,
        currentQuestion: Number,
        changeCurrentQuestion: Function,
        answeredQuestions: Array,
        step: String,
        blockActionBtns: Boolean,
        sendAnswers: Function,
        showResultDialog: Boolean,
        exitExam: Function,
        examResults: Object || undefined,
        timer: Number,
        startResultDialogTimer: Boolean
    },
    components:{
        ResultDialog
    },
    computed: mapGetters(['getUserData', 'currentLang', 'getDepartments']),
    mounted(){
        console.log(this.getUserData);
    },
    methods:{
        mapOrient(){
            const target = document.querySelector(`.map-${this.currentQuestion}`)
            if(target){
                target.scrollIntoView({behavior: "smooth"})
            }
        },

        // TODO:
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

        getPosition(department, position){
            const departments = this.getDepartments
            let positionName = 'unknown'

            departments.forEach(item=>{
                if(item.id == department){
                    item.positions.forEach(value=>{
                        if(value.id==position){
                            positionName = value.name.ru
                        }
                    })
                }
            })

            return positionName
        }
    },
    watch:{
        currentQuestion(){
            this.mapOrient()
        }
    }
}
</script>


<style scoped>
::-webkit-scrollbar {
    width: 6px;
    display: block;
    background-color: #b9b9b91b;
}

::-webkit-scrollbar-thumb {
    background-color: #d6d6d69a;
    border-radius: 1em;
}
.sidebar{
    position: fixed;
    height: 100%;
    width: 250px;
    background-color: var(--special-color);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30px 20px;
    gap: 50px;
}

.map-item{
    scroll-margin-top:120px;
}

.map-item:hover{
    background-color: #ffffff0e;
}

.v-table{
    background: none;
    font-size: 0.9em;
}
.table-body{
    height: 50vh;
    max-height: 50vh;
    overflow-y: scroll;
    overflow-x: hidden;
}
#app > div > div > main > div > div.main > div.sidebar > div > div.map > div.map__table > div > div > table > thead{
    background-color: #ffffff0d
}
#app > div > div > main > div > div.main > div.sidebar > div  > div.map > div.map__table > div > div > table > thead > tr > th{
    padding: 0 7px;
}
#app > div > div > main > div > div.main > div.sidebar > div  > div.map > div.map__table > div.table-body > div > div > table > tbody > tr > td{
    padding: 0 7px;
    color: #fff;
    font-weight: 300;
    overflow: hidden;
    cursor: pointer;
}
#app > div > div > main > div > div.main > div.sidebar > div  > div.map > div.map__table > div.table-body > div > div > table > tbody > tr:hover{
    background-color: #ffffff0e;
}
</style>

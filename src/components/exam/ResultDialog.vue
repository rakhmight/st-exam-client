<template>
    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <template v-slot:activator="{ props }">
        <v-btn
        density="compact"
        width="100%"
        v-bind="props"
        :color="blockActionBtns ? '#999' : 'var(--main-color)'"
        :disabled="blockActionBtns"
        @click="sendAnswers('send')"
        v-show="getCurrentModuleExam.params.changeAnswerPossibility && answeredQuestions.length == ticket.questions.length || ticket.questions.find(q => q.multipleAnswers) && answeredQuestions.length == ticket.questions.length"
        >                    
            <v-icon size="15" :color="blockActionBtns ? '#444' : '#fff'">mdi-send</v-icon>
            <span class="ml-1"  style="font-size: 0.9em;" :style="blockActionBtns ? 'color: #444' : 'color: #fff'">{{ currentLang.examView[14] }}</span>
        </v-btn>
      </template>

      <div class="card">
        <div class="card__header d-flex flex-column align-center">
          <div style="width: 70px;">
              <v-img src="@/assets/media/logo.png"></v-img>
          </div>
          <div class="mt-1">
            <span style="font-size: 1.4em; font-weight: 500; color: var(--special-color)">{{ currentLang.examView[15] }}</span>
          </div>

          <div class="timer" v-if="getCurrentModuleExam.params.resultDisplayTime!=null">
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <div style="cursor: help" v-bind="props" class="d-flex align-center">
                  <v-icon size="20" color="var(--main-color)">mdi-alarm</v-icon>
                  <span class="ml-1">{{ formatTime(resultTimer) }}</span>
                </div>
              </template>
              <span>{{ currentLang.examView[56] }}</span>
            </v-tooltip>
          </div>
        </div>

        <v-divider class="mt-3 mb-7"></v-divider>

        <div class="card__content" v-if="examResults && getCurrentModuleExam.params.showResults">

          <div class="w-100 h-auto d-flex flex-column align-center" style="gap: 30px">
            
            <table style="width: 80%">
              <tr>
                <td>
                  <div class="d-flex align-center">
                    <v-icon size="17" color="var(--main-color)">mdi-radiobox-marked</v-icon>
                    <span class="td-title ml-1">{{ currentLang.examView[16] }}:</span>
                  </div>
                </td>
                <td>
                  <span style="font-weight: 500; color: var(--red-color); font-size: 2em;">{{ examResults.grade }}</span>
                </td>
              </tr>

              <tr v-if="getCurrentModuleExam.params.displayedResultParams.indexOf('percentage')!=-1">
                <td>
                  <div class="d-flex align-center">
                    <v-icon size="17" color="var(--main-color)">mdi-percent</v-icon>
                    <span class="td-title ml-1">{{ currentLang.examView[17] }}:</span>
                  </div>
                </td>
                <td>
                  <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                          <span style="cursor: help;" v-bind="props" class="td-ctx">{{ examResults.percentage.toFixed(0) }}%</span>
                      </template>
                      <span>{{ examResults.percentage }}</span>
                  </v-tooltip>
                </td>
              </tr>

              <tr v-if="getCurrentModuleExam.params.displayedResultParams.indexOf('spentTime')!=-1">
                <td>
                  <div class="d-flex align-center">
                    <v-icon size="17" color="var(--main-color)">mdi-clock-time-three</v-icon>
                    <span class="td-title ml-1">{{ currentLang.examView[47] }}:</span>
                  </div>
                </td>
                <td>
                  <span class="td-ctx">{{ formatTime(getCurrentModuleExam.params.examTime*60-timer) }}</span>
                </td>
              </tr>
              
              <tr v-if="getCurrentModuleExam.params.displayedResultParams.indexOf('ball')!=-1">
                <td>
                  <div class="d-flex align-center">
                    <v-icon size="17" color="var(--main-color)">mdi-star</v-icon>
                    <span class="td-title ml-1">{{ currentLang.examView[44] }}:</span>
                  </div>
                </td>
                <td>
                  <span class="td-ctx">
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                          <span style="cursor: help;" v-bind="props">{{ examResults.ball.score.toFixed(0) }}</span>
                      </template>
                      <span>{{ currentLang.examView[45] }}: {{ examResults.ball.score }}</span>
                    </v-tooltip>
                    /
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                          <span style="cursor: help;" v-bind="props">{{ examResults.ball.maxBall.toFixed(0) }}</span>
                      </template>
                      <span>{{ currentLang.examView[46] }}: {{ examResults.ball.maxBall }}</span>
                    </v-tooltip>
                  </span>
                </td>
              </tr>

              <tr v-if="getCurrentModuleExam.params.displayedResultParams.indexOf('showAStat')!=-1">
                <td><span class="td-title">{{ currentLang.examView[21] }}:</span></td>
                <td><span style="color: rgb(40 138 0); font-weight: 500;">{{ examResults.questions.correct }}</span></td>
              </tr>

              <tr v-if="getCurrentModuleExam.params.displayedResultParams.indexOf('showAStat')!=-1">
                <td><span class="td-title">{{ currentLang.examView[22] }}</span></td>
                <td><span style="color: var(--red-color); font-weight: 500;">{{ examResults.questions.wrong }}</span></td>
              </tr>
            </table>

            <v-divider style="width: 100%"></v-divider>

            <table style="width: 80%">
              <tr>
                <td>
                  <div class="d-flex align-center">
                    <v-icon size="17" color="var(--main-color)">mdi-account</v-icon>
                    <span class="td-title ml-1">{{ getUserData.userData.userRole=='student' ? currentLang.examView[23] : getUserData.userData.userRole=='enrollee' ? currentLang.examView[24] : getUserData.userData.userRole=='teacher' ? currentLang.examView[25] : getUserData.userData.userRole=='employee' ? currentLang.examView[26] : 'unknown' }}:</span>
                  </div>
                </td>
                <td>
                  <span>{{ `${getUserData.userData.bio.firstName ? getUserData.userData.bio.firstName : ''} ${getUserData.userData.bio.lastName ? getUserData.userData.bio.lastName : ''} ${getUserData.userData.bio.patronymic ? getUserData.userData.bio.patronymic : ''}` }}</span>
                </td>
              </tr>
              
              <tr v-if="getUserData.userData.userRole=='student' || getUserData.userData.userRole=='enrollee'">
                <td>
                  <span class="td-title">{{ currentLang.examView[27] }}:</span>
                </td>
                <td>
                  <span>{{ getForm() }}</span>
                </td>
              </tr>
              
              <tr v-if="getUserData.userData.userRole=='student'">
                <td>
                  <span class="td-title">{{ currentLang.examView[28] }}:</span>
                </td>
                <td>
                  <span>{{ getCourse() }}</span>
                </td>
              </tr>
              
              <tr v-if="getUserData.userData.userRole=='student' || getUserData.userData.userRole=='enrollee'">
                <td>
                  <span class="td-title">{{ currentLang.examView[29] }}:</span>
                </td>
                <td>
                  <span>{{ getGroup() }}</span>
                </td>
              </tr>
              
              <tr v-if="getUserData.userData.userRole=='teacher' || getUserData.userData.userRole=='employee'">
                <td>
                  <span class="td-title">{{ getUserData.userData.userRole=='teacher' ? currentLang.examView[30] : getUserData.userData.userRole=='employee' ? currentLang.examView[31] : 'unknown' }}:</span>
                </td>
                <td>
                  <span>{{ getDepartment() }}</span>
                </td>
              </tr>
            </table>
            
            <v-divider
            v-if="getCurrentModuleExam.params.displayedResultParams.indexOf('wrongQ')!=-1 ||
            getCurrentModuleExam.params.displayedResultParams.indexOf('wrongThA')!=-1 ||
            getCurrentModuleExam.params.displayedResultParams.indexOf('wrongQA')!=-1"
            style="width: 100%"
            ></v-divider>
            
            <div
            class="d-flex flex-column"
            style="width: 90%; gap: 15px"
            v-if="getCurrentModuleExam.params.displayedResultParams.indexOf('wrongQ')!=-1">

              <div class="d-flex align-center">
                  <v-icon size="17" color="var(--main-color)">mdi-file-question</v-icon>
                  <span class="td-title ml-1" style="font-size: 1.15em;">{{ currentLang.examView[49] }}:</span>
              </div>
              <table
              class="special-table w-100"
              >
                <tr>
                  <th style="color: #777; font-size: 0.9rem">ID</th>
                  <th style="color: #777; font-size: 0.9rem;">{{ currentLang.examView[48] }}</th>
                </tr>

                <tr
                  v-for="fault in examResults.faults"
                  :key="fault.id"
                >
                  <td style="padding: 10px;">
                    <div class="d-flex align-center" style="gap: 4px">
                      <v-icon color="var(--red-color)" style="font-size: medium;">mdi-help-circle</v-icon>
                      <p>{{ fault.id }}</p>
                    </div>
                  </td>
                  <td style="padding: 10px 5px;">{{ getQuestionCtx(fault.id) }}</td>
                </tr>
              </table>
            </div>
            
            <div
            style="width: 90%"
            v-if="getCurrentModuleExam.params.displayedResultParams.indexOf('wrongThA')!=-1">
            </div>

            <div
            style="width: 90%; gap: 15px"
            v-if="getCurrentModuleExam.params.displayedResultParams.indexOf('wrongQA')!=-1">
              <div class="d-flex align-center">
                  <v-icon size="17" color="var(--main-color)">mdi-ab-testing</v-icon>
                  <span class="td-title ml-1" style="font-size: 1.15em;">{{ currentLang.examView[49] }}:</span>
              </div>
              <table
              class="special-table w-100"
              >
                <tr>
                  <th style="color: #777; font-size: 0.9rem">ID</th>
                  <th style="color: #777; font-size: 0.9rem;">{{ currentLang.examView[50] }}</th>
                </tr>

                <tr
                  v-for="fault in examResults.faults"
                  :key="fault.id"
                >
                  <td style="padding: 10px;">
                    <div class="d-flex align-center" style="gap: 4px">
                      <v-icon color="var(--red-color)" style="font-size: medium;">mdi-help-circle</v-icon>
                      <p>{{ fault.id }}</p>
                    </div>
                  </td>
                  <td style="padding: 10px; gap: 10px" class="d-flex flex-column">
                    <div>
                      - {{ getQuestionCtx(fault.id) }}
                    </div>

                    <div class="d-flex flex-column" style="gap: 5px" v-if="getQuestionAnswers(fault.id)!=null">
                      <div class="d-flex flex-row align-center" style="gap: 5px" v-for="answer in getQuestionAnswers(fault.id)" :key="answer.id">
                        <v-tooltip>
                        <template v-slot:activator="{ props }">                          
                          <v-icon v-bind="props" color="#777" style="font-size: medium; overflow: unset;" v-if="!answerIsChoice(fault.id, answer.id)">mdi-circle-outline</v-icon>
                          <v-icon v-bind="props" color="var(--main-color)" style="font-size: medium; overflow: unset;" v-else>mdi-circle</v-icon>
                        </template>
                        <span v-if="!answerIsChoice(fault.id, answer.id)" style="cursor: help">{{ currentLang.examView[51] }}</span>
                        <span v-else>{{ currentLang.examView[52] }}</span>
                        </v-tooltip>
<!--  -->
                        <p>{{ answer.ctx }}</p>
                        
                        <v-tooltip>
                        <template v-slot:activator="{ props }">
                          <v-icon v-bind="props" color="green" style="font-size: medium; overflow: unset;" v-if="answerIsCorrect(fault.id, answer.id)">mdi-check-circle</v-icon>
                          <v-icon v-bind="props" color="var(--red-color)" style="font-size: medium; overflow: unset;" v-else>mdi-close-circle</v-icon>
                        </template>
                        <span v-if="answerIsCorrect(fault.id, answer.id)">{{ currentLang.examView[53] }}</span>
                        <span v-else>{{ currentLang.examView[54] }}</span>
                        </v-tooltip>
                      </div>
                    </div>
                    <div v-else class="d-flex align-center" style="gap: 5px">
                      <v-icon color="var(--red-color)" style="font-size: medium;">mdi-image-filter-center-focus-weak</v-icon>
                      <p>{{ currentLang.examView[55] }}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>

        </div>

        <div class="card__loader" v-if="!examResults">
            <div style="position: relative;">
                <div style="position: absolute; overflow: hidden;  top:22px; left: 17px;">
                    <v-img width="70px" src="@/assets/media/send.png"></v-img>
                </div>

                <v-progress-circular
                :size="110"
                :width="3"
                color="var(--main-color)"
                indeterminate
                style="overflow: hidden;"
                ></v-progress-circular>
            </div>
            <span class="mt-7" style="color:#444; text-transform:uppercase; font-weight: 500;">{{ currentLang.examView[32] }}..</span>
        </div>

        <div class="w-100 d-flex justify-center mt-3" v-if="examResults && getCurrentModuleExam.params.showResults">
          <v-btn
            density="compact"
            width="200px"
            color="var(--main-color)"
            class="d-flex align-center"
            @click="exitExam()"
            >
              <v-icon size="17" color="#fff">mdi-exit-to-app</v-icon>
              <span style="color: #fff" class="ml-1">{{ currentLang.examView[33] }}</span>
          </v-btn>
        </div>
      </div>
    </v-dialog>
</template>


<script>
import { mapGetters } from 'vuex';

export default {
    props:{
        ticket: Object,
        blockActionBtns: Boolean,
        sendAnswers: Function,
        showResultDialog: Boolean,
        exitExam: Function,
        examResults: Object || undefined,
        answeredQuestions: Array,
        timer: Number,
        answers: Array
    },
    computed: mapGetters(['getUserData', 'getUsersList', 'getDepartments', 'getCurrentExam', 'currentLang', 'getCurrentModuleExam', 'getExamLanguage']),
    data(){
        return {
            dialog: false,
            userData: undefined,
            resultTimer: undefined,
            resultTimerInterval: undefined,
        }
    },
    watch:{
        showResultDialog(){
          if(this.showResultDialog){
            this.dialog = true

            if(this.getCurrentModuleExam.params.resultDisplayTime!=null){
              this.resultTimer = this.getCurrentModuleExam.params.resultDisplayTime
              
              this.resultTimerInterval = setInterval(()=>{
                if(this.resultTimer!=0) this.resultTimer-=1
                else{
                  clearInterval(this.resultTimerInterval)
                  this.exitExam(true)
                }
              }, 1000)
            }
          }
        },

        dialog(){
          if(this.showResultDialog){
            this.dialog = true
          } else {
            this.dialog = false
          }
        },

        answers(){
          console.log(this.answers);
        }
    },
    methods: {
      // getUserInfo(){
      //   console.log(this.getUserData);
      //   const user = this.getUsersList.find(user => user.id == this.getUserData.authData.id)
      //   console.log(user);

      //   if(user.userRole == 'student') return `Студент: ${user.roleProperties.educationForm == 'full-time' ? 'очная форма обучения' : user.roleProperties.educationForm == 'in-absentia' ? 'заочная форма обучения' : user.roleProperties.educationForm == 'magistracy' ? 'магистратура' : 'unknown'}, ${this.getCourse(+user.roleProperties.recieptDate)}-курс, ${user.roleProperties.group} группа`
      //   else if(user.userRole == 'enrollee') return `Абитуриент: ${user.roleProperties.formOfEducation == 'full-time' ? 'очная форма обучения' : user.roleProperties.formOfEducation == 'in-absentia' ? 'заочная форма обучения' : user.roleProperties.formOfEducation == 'magistracy' ? 'магистратура' : 'unknown'}, ${user.roleProperties.group} группа`
      //   else if(user.userRole == 'teacher') return `Преподаватель: ${this.getDepartment(user.roleProperties.department)}`
      //   else if(user.userRole == 'employee') return `Сотрудник: ${this.getDepartment(user.roleProperties.department)}`
      // },

        // Форматирует таймер
      
      answerIsChoice(questionID, answerID){
        const target = this.answers.find(answer=>answer.id==questionID)
        const index = this.answers.indexOf(target)
        
        const questionData = this.ticket.questions.find(q => q.id == questionID)
        if(questionData.type != 'question-with-field'){
          if(Array.isArray(this.answers[index].answer)){
            return this.answers[index].answer.find(a => a == answerID)
          } else {
            return this.answers[index].answer==answerID
          }
        }
      },
      answerIsCorrect(questionID, answerID){        
        const questionData = this.examResults.faults.find(fault => fault.id == questionID)
        if(questionData.type != 'question-with-field'){
          return questionData.answers.find(a => a == answerID)
        }
      },

      getQuestionAnswers(questionID){
        const questionData = this.ticket.questions.find(q => q.id == questionID)
        const answers = []
        
        if(questionData && questionData.type != 'question-with-field'){
          const answersTemp = questionData.context.answers.map(answer => {
            return {
              id: answer.id,
              ctx: this.getExamLanguage=='ru' ? answer.answerCtx.ru : this.getExamLanguage=='eng' ? answer.answerCtx.eng : this.getExamLanguage=='custom' ? answer.answerCtx.custom : this.getExamLanguage=='uz_k' ? answer.answerCtx.uz_k : this.getExamLanguage=='uz_l' ? answer.answerCtx.uz_l : 'unknown'
            }
          })

          answers.push(...answersTemp)
        
          return answers
        }
        return null
      },

      formatTime(time) {
          const minutes = Math.floor(time / 60)
          let seconds = time % 60

          if (seconds < 10) {
              seconds = `0${seconds}`
          }

          return `${minutes}:${seconds}`
      },
      
      getQuestionCtx(questionID){
        const questionData = this.ticket.questions.find(q => q.id == questionID)

        if(questionData){
          return this.getExamLanguage=='ru' ? questionData.context.questionCtx.ru : this.getExamLanguage=='eng' ? questionData.context.questionCtx.eng : this.getExamLanguage=='custom' ? questionData.context.questionCtx.custom : this.getExamLanguage=='uz_k' ? questionData.context.questionCtx.uz_k : questionData.context.questionCtx.uz_l
        } else return 'unknown'
      },

      getForm(){
        if(this.getUserData.userData.userRole == 'student') return `${this.userData.roleProperties.educationForm == 'full-time' ? this.currentLang.examView[34] : this.userData.roleProperties.educationForm == 'in-absentia' ? this.currentLang.examView[35] : this.userData.roleProperties.educationForm == 'magistracy' ? this.currentLang.examView[36] : 'unknown'}`
        else if(this.getUserData.userData.userRole == 'enrollee') return `${this.userData.roleProperties.formOfEducation == 'full-time' ? this.currentLang.examView[34] : this.userData.roleProperties.formOfEducation == 'in-absentia' ? this.currentLang.examView[35] : this.userData.roleProperties.formOfEducation == 'magistracy' ? this.currentLang.examView[36] : 'unknown'}`
      },

      getCourse(){
        let year = +this.userData.roleProperties.recieptDate

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

      getGroup(){
        return this.userData.roleProperties.group
      },

      getDepartment(){
        const department = this.userData.roleProperties.department
        const departmentName= this.getDepartments.find(item => item.id == department) || 'unknown'
        return departmentName.name.ru || departmentName.id
      },
    },
    mounted(){
      this.userData = this.getUsersList.find(user => user.id == this.getUserData.authData.id)
    },
    unmounted(){
      if(this.resultTimerInterval){
        clearInterval(this.resultTimerInterval)
      }
    }
}
</script>


<style scoped>
::-webkit-scrollbar {
    width: 6px;
    display: block;
}

.card{
  padding: 20px;
  width: 800px;
  background-color: #fff;
  border-radius: 5px;
}

.card__header {
  position: relative;
}
.timer{
  position: absolute;
  top: 0;
  right: 0;
}

.card__content{
  max-height: 500px;
  min-height: 500px;
  overflow-y: auto;
}

.card__content>div>table{
  font-size: 1.15em;
  width: 80%;
	border-spacing: 10px;
	border-collapse: separate;
}
.card__content>table>tr>td:nth-child(2){
  text-align: right;
}
.td-title{
  font-weight: 500;
}
.td-ctx{
  color: var(--main-color)
}

.special-table {
  border-collapse: collapse;
  border: 1px solid #b9b9b9
}
.special-table>tr>th, .special-table>tr>td{
  border: 1px solid #b9b9b9
}

.card__loader{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 500px;
}
</style>

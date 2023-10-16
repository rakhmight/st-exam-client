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

          <!-- <div class="timer">
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <div style="cursor: help" v-bind="props" class="d-flex align-center">
                  <v-icon size="20" color="var(--main-color)">mdi-alarm</v-icon>
                  <span class="ml-1">00:00</span>
                </div>
              </template>
              <span>Время, отведённое для ознакомления с результатом</span>
            </v-tooltip>
          </div> -->
        </div>

        <v-divider class="mt-3 mb-7"></v-divider>

        <div class="card__content" v-if="examResults && getCurrentModuleExam.params.showResults">
          <table>
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

          <v-divider></v-divider>

          <table>
            <tr>
              <td>
                <div class="d-flex align-center">
                  <v-icon size="17" color="var(--main-color)">mdi-account</v-icon>
                  <span class="td-title ml-1">{{ getUserData.userData.userRole=='student' ? currentLang.examView[23] : getUserData.userData.userRole=='enrollee' ? currentLang.examView[24] : getUserData.userData.userRole=='teacher' ? currentLang.examView[25] : getUserData.userData.userRole=='employee' ? currentLang.examView[26] : 'unknown' }}:</span>
                </div>
              </td>
              <td>
                <span>{{ `${getUserData.userData.bio.lastName} ${getUserData.userData.bio.firstName} ${getUserData.userData.bio.patronymic}` }}</span>
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
        answeredQuestions: Array
    },
    computed: mapGetters(['getUserData', 'getUsersList', 'getDepartments', 'getCurrentExam', 'currentLang', 'getCurrentModuleExam']),
    data(){
        return {
            dialog: false,
            userData: undefined
        }
    },
    watch:{
        showResultDialog(){
          if(this.showResultDialog){
            this.dialog = true
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
  overflow-y: auto;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.card__content>table{
  font-size: 1.15em;
  width: 80%;
	border-spacing: 10px;
	border-collapse: separate;
}
.card__content>table>tr>td:nth-child(2){
  text-align: right;
}
.td-title{
  font-weight: 500
}
.td-ctx{
  color: var(--main-color)
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

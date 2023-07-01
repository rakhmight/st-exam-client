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
        v-show="false"
        >                    
            <v-icon size="15" :color="blockActionBtns ? '#444' : '#fff'">mdi-send</v-icon>
            <span class="ml-1"  style="font-size: 0.9em;" :style="blockActionBtns ? 'color: #444' : 'color: #fff'">Отправить</span>
        </v-btn>
      </template>

      <div class="card">
        <div class="card__header d-flex flex-column align-center">
          <div style="width: 70px;">
              <v-img src="@/assets/media/logo.png"></v-img>
          </div>
          <div class="mt-1">
            <span style="font-size: 1.4em; font-weight: 500; color: var(--special-color)">Ваш результат</span>
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

        <div class="card__content" v-if="examResults">
          <table>
            <tr>
              <td>
                <div class="d-flex align-center">
                  <v-icon size="17" color="var(--main-color)">mdi-radiobox-marked</v-icon>
                  <span class="td-title ml-1">Оценка:</span>
                </div>
              </td>
              <td>
                <span style="font-weight: 500; color: var(--red-color); font-size: 2em;">{{ examResults.grade }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <div class="d-flex align-center">
                  <v-icon size="17" color="var(--main-color)">mdi-percent</v-icon>
                  <span class="td-title ml-1">Процентное соотношение:</span>
                </div>
              </td>
              <td>
                <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                        <span style="cursor: help;" v-bind="props" class="td-ctx">{{ examResults.percentage.toFixed(2) }}%</span>
                    </template>
                    <span>{{ examResults.percentage }}</span>
                </v-tooltip>
              </td>
            </tr>
            <tr>
              <td>
                <div class="d-flex align-center">
                  <v-icon size="17" color="var(--main-color)">mdi-star</v-icon>
                  <span class="td-title ml-1">Балл:</span>
                </div>
              </td>
              <td>
                <span class="td-ctx">
                  <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                        <span style="cursor: help;" v-bind="props">{{ examResults.ball.score.toFixed(2) }}</span>
                    </template>
                    <span>набранный вами балл: {{ examResults.ball.score }}</span>
                  </v-tooltip>
                  /
                  <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                        <span style="cursor: help;" v-bind="props">{{ examResults.ball.maxBall.toFixed(2) }}</span>
                    </template>
                    <span>макс. балл по билету: {{ examResults.ball.maxBall }}</span>
                  </v-tooltip>
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <div class="d-flex align-center">
                  <v-icon size="17" color="var(--main-color)">mdi-help-circle-outline</v-icon>
                  <span class="td-title ml-1">Вопросы:</span>
                </div>
              </td>
              <td>
                <span class="td-ctx">
                  <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                        <span style="cursor: help;" v-bind="props">{{ examResults.questions.correct }}</span>
                    </template>
                    <span>верные ответы</span>
                  </v-tooltip>
                  /
                  <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                        <span style="cursor: help; color: var(--red-color);" v-bind="props">{{ examResults.questions.wrong }}</span>
                    </template>
                    <span>неверные ответы</span>
                  </v-tooltip>
                </span>
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
            <span class="mt-7" style="color:#444; text-transform:uppercase; font-weight: 500;">Отправка ответов на проверку..</span>
        </div>

        <div class="w-100 d-flex justify-center mt-3" v-if="examResults">
          <v-btn
            density="compact"
            width="200px"
            color="var(--main-color)"
            class="d-flex align-center"
            @click="exitExam()"
            >
              <v-icon size="17" color="#fff">mdi-exit-to-app</v-icon>
              <span style="color: #fff" class="ml-1">Выйти</span>
          </v-btn>
        </div>
      </div>
    </v-dialog>
</template>


<script>
export default {
    props:{
        blockActionBtns: Boolean,
        sendAnswers: Function,
        showResultDialog: Boolean,
        exitExam: Function,
        examResults: Object || undefined
    },
    data(){
        return {
            dialog: false
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
  overflow-y: auto;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

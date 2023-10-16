<template>
    <div class="content exam-content" v-if="question">
        <div class="content__main">
            <div class="question d-flex align-center" style="gap: 15px">
                <v-icon color="var(--main-color)">mdi-help-circle-outline</v-icon>
                <div class="ctx">
                    {{ getExamLanguage=='ru' ? question.context.questionCtx.ru : getExamLanguage=='eng' ? question.context.questionCtx.eng : getExamLanguage=='custom' ? question.context.questionCtx.custom : getExamLanguage=='uz_k' ? question.context.questionCtx.uz_k : getExamLanguage=='uz_l' ? question.context.questionCtx.uz_l : getExamLanguage=='fr' ? question.context.questionCtx.fr : question.context.questionCtx.de }}
                </div>
            </div>

            <div class="question-img d-flex justify-center" v-if="question.type=='question-with-images' || question.type=='question-with-field'">
                <div class="qwi" style="width: 55%;" v-if="question.type=='question-with-images' && question.context.imagePreview">
                    <v-img :src="question.context.imagePreview"></v-img>
                </div>
                <div class="qwf mt-3" style="width: 100%;" v-if="question.type=='question-with-field' && question.context.imagePreview">
                    <v-img
                    style="margin: 0 auto; border: 2px var(--main-color) solid; position: relative"
                    width="955"
                    height="540"
                    :src="question.context.imagePreview"
                    :class="`img_${question.id}`"
                    @click="getPosition()"
                    ></v-img>
                </div>
            </div>

            <v-divider color="#888" style="opacity: 0.5;" v-if="question.type!='question-with-field'"></v-divider>

            <!-- Одиночные ответы -->
            <v-radio-group
            density="compact"
            color="var(--main-color)"
            v-if="question.type!='question-with-field' && !question.multipleAnswers"
            v-model="choisedAnswer"
            >
            <div class="answers" v-if="randAnswers">
                <div class="answer d-flex flex-column" v-for="(answer, i) in randAnswers" :key="answer.id">
                    <div class="d-flex align-center" style="gap:10px">
                        <div>
                            <v-radio @click="reset(answer.id)" :value="answer.id" :class="`answer-${i}`" class="pl-2 pr-2"></v-radio>
                        </div>

                        <div class="ctx" v-if="getExamLanguage=='ru' && answer.answerCtx.ru || getExamLanguage=='eng' && answer.answerCtx.eng || getExamLanguage=='custom' && answer.answerCtx.custom || getExamLanguage=='uz_l' && answer.answerCtx.uz_l || getExamLanguage=='uz_k' && answer.answerCtx.uz_k || getExamLanguage=='fr' && answer.answerCtx.fr || getExamLanguage=='de' && answer.answerCtx.de" :style="choisedAnswer==answer.id ? 'border: 1px solid var(--main-color);background: #0d5fd80d;' : ''">
                            {{ getExamLanguage=='ru' ? answer.answerCtx.ru : getExamLanguage=='eng' ? answer.answerCtx.eng : getExamLanguage=='custom' ? answer.answerCtx.custom : getExamLanguage=='uz_k' ? answer.answerCtx.uz_k : getExamLanguage=='uz_l' ? answer.answerCtx.uz_l : getExamLanguage=='fr' ? answer.answerCtx.fr : answer.answerCtx.de }}
                        </div>
                        
                        <div style="width: 120px;" class="mt-2" v-if="getExamLanguage=='ru' && !answer.answerCtx.ru && answer.imagePreview || getExamLanguage=='eng' && !answer.answerCtx.eng && answer.imagePreview || getExamLanguage=='custom' && !answer.answerCtx.custom && answer.imagePreview || getExamLanguage=='uz_l' && !answer.answerCtx.uz_l && answer.imagePreview || getExamLanguage=='uz_k' && !answer.answerCtx.uz_k && answer.imagePreview || getExamLanguage=='fr' && !answer.answerCtx.fr && answer.imagePreview || getExamLanguage=='de' && !answer.answerCtx.de && answer.imagePreview">
                            <v-img :src="answer.imagePreview"></v-img>
                        </div>
                    </div>
                    
                    <div class="d-flex justify-center" v-if="answer.imagePreview && answer.answerCtx.ru && getExamLanguage=='ru' || answer.imagePreview && answer.answerCtx.eng && getExamLanguage=='eng' || answer.imagePreview && answer.answerCtx.custom && getExamLanguage=='custom' || answer.imagePreview && answer.answerCtx.uz_l && getExamLanguage=='uz_l' || answer.imagePreview && answer.answerCtx.uz_k && getExamLanguage=='uz_k' || answer.imagePreview && answer.answerCtx.fr && getExamLanguage=='fr' || answer.imagePreview && answer.answerCtx.de && getExamLanguage=='de'">
                        <div style="width: 120px;" class="mt-2">
                            <v-img :src="answer.imagePreview"></v-img>
                        </div>
                    </div>
                </div>
            </div>
            </v-radio-group>

            <!-- Мульти ответы -->
            <div class="answers" v-if="question.type!='question-with-field' && question.multipleAnswers && randAnswers">
                <div class="answer d-flex flex-column" v-for="(answer, i) in randAnswers" :key="i">
                    <div class="d-flex align-center" style="gap:15px">
                        <div style="width: 40px;">
                            <v-checkbox
                            density="compact"
                            color="var(--main-color)"
                            v-model="choisedAnswers"
                            :value="answer.id"
                            :class="`answer-${i}`"
                            class="ml-2"
                            ></v-checkbox>
                        </div>
                        <div class="ctx" v-if="getExamLanguage=='ru' && answer.answerCtx.ru || getExamLanguage=='eng' && answer.answerCtx.eng || getExamLanguage=='custom' && answer.answerCtx.custom || getExamLanguage=='uz_l' && answer.answerCtx.uz_l || getExamLanguage=='uz_k' && answer.answerCtx.uz_k || getExamLanguage=='fr' && answer.answerCtx.fr || getExamLanguage=='de' && answer.answerCtx.de" :style="choisedAnswers.indexOf(answer.id)!=-1 ? 'border: 1px solid var(--main-color);background: #0d5fd80d;' : ''">
                            {{ getExamLanguage=='ru' ? answer.answerCtx.ru : getExamLanguage=='eng' ? answer.answerCtx.eng : getExamLanguage=='custom' ? answer.answerCtx.custom : getExamLanguage=='uz_k' ? answer.answerCtx.uz_k : getExamLanguage=='uz_l' ? answer.answerCtx.uz_l : getExamLanguage=='fr' ? answer.answerCtx.fr : answer.answerCtx.de }}
                        </div>
                        
                        
                        <div style="width: 120px;" class="mt-2" v-if="getExamLanguage=='ru' && !answer.answerCtx.ru && answer.imagePreview || getExamLanguage=='eng' && !answer.answerCtx.eng && answer.imagePreview || getExamLanguage=='custom' && !answer.answerCtx.custom && answer.imagePreview || getExamLanguage=='uz_l' && !answer.answerCtx.uz_l && answer.imagePreview || getExamLanguage=='uz_k' && !answer.answerCtx.uz_k && answer.imagePreview || getExamLanguage=='fr' && !answer.answerCtx.fr && answer.imagePreview || getExamLanguage=='de' && !answer.answerCtx.de && answer.imagePreview">
                            <v-img :src="answer.imagePreview"></v-img>
                        </div>
                    </div>
                    <div class="d-flex justify-center" v-if="answer.imagePreview && answer.answerCtx.ru && getExamLanguage=='ru' || answer.imagePreview && answer.answerCtx.eng && getExamLanguage=='eng' || answer.imagePreview && answer.answerCtx.custom && getExamLanguage=='custom' || answer.imagePreview && answer.answerCtx.uz_l && getExamLanguage=='uz_l' || answer.imagePreview && answer.answerCtx.uz_k && getExamLanguage=='uz_k' || answer.imagePreview && answer.answerCtx.fr && getExamLanguage=='fr' || answer.imagePreview && answer.answerCtx.de && getExamLanguage=='de'">
                        <div style="width: 120px;" class="mt-2">
                            <v-img :src="answer.imagePreview"></v-img>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="content__footer">
            <div></div>
            <div class="d-flex justify-space-between">
                <div>
                    <v-btn
                    variant="text"
                    icon
                    size="32"
                    @click="previewQuestion()"
                    >
                    <v-icon size="27">mdi-arrow-left-thin-circle-outline</v-icon>
                    </v-btn>
                </div>
                <div>
                    <v-btn
                    variant="text"
                    icon
                    size="32"
                    @click="nextQuestion()"
                    >
                    <v-icon size="27">mdi-arrow-right-thin-circle-outline</v-icon>
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        ticket: Object,
        currentQuestion: Number,
        getExamLanguage: String,
        giveAnswer: Function,
        answers: Array,
        makeZoom: Function,
        blockSavingProcess: Boolean,
        savingsClone: Array,
        switchAnswerCloneState: Function,
        answerCloneSwitched: Boolean,
        switchingAnswerClone: Function,
        nextQuestion: Function,
        previewQuestion: Function
    },
    data(){
        return {
            choisedAnswers: [],
            choisedAnswer: null,
            question: null,
            switchQuestionStep: false,

            randAnswers: []
        }
    },
    watch:{
        currentQuestion(){
            this.switchQuestion()
        },

        choisedAnswer(){

            let answerClone
            // проверка на сохранения
            if(this.savingsClone.length){
                answerClone = this.savingsClone.find(answer=>answer.questionID==this.question.id)
            }

            // одиноответный вопрос + сохранённый ответ отсутствует
            if(
                !this.question.multipleAnswers && !answerClone ||
                !this.question.multipleAnswers && answerClone.answer!==null && answerClone.isChecked ||
                !this.question.multipleAnswers && answerClone.answer===null && answerClone.isChecked
            ){
                console.log('choisedAnswer', this.choisedAnswer)
                if(this.choisedAnswer!==null){
                    this.giveAnswer(this.question.id, this.choisedAnswer)
                } else if(this.choisedAnswer===null){
                    this.giveAnswer(this.question.id, this.choisedAnswer)
                }
            } else if(answerClone && !this.blockSavingProcess){
                console.log('there!2');
                if(
                    !this.question.multipleAnswers && answerClone.answer!==null && !answerClone.isChecked ||
                    !this.question.multipleAnswers && answerClone.answer===null && !answerClone.isChecked
                ){
                        this.giveAnswer(this.question.id, this.choisedAnswer, true)
                        this.switchAnswerCloneState(this.question.id)
                }
            }

            // if(this.savingsClone.length && !this.blockSavingProcess && !this.question.multipleAnswers){
            //     const answerClone = this.savingsClone.find(answer=>answer.questionID==this.question.id)

            //     if(
            //         answerClone.answer!==null && !answerClone.isChecked ||
            //         answerClone.answer===null && !answerClone.isChecked
            //     ){
            //         this.giveAnswer(this.question.id, this.choisedAnswers, true)
            //         if(!this.answerCloneSwitched){
            //             this.switchAnswerCloneState(this.question.id)
            //         } else {
            //             this.switchingAnswerClone()
            //         }
            //     } else {
            //         this.giveAnswer(this.question.id, this.choisedAnswer)
            //     }
            // } else {
            //     if(!this.switchQuestionStep && !this.blockSavingProcess){
            //         this.giveAnswer(this.question.id, this.choisedAnswer)
            //     }
            // }
        },

        choisedAnswers(){

            let answerClone
            // проверка на сохранения
            if(this.savingsClone.length){
                answerClone = this.savingsClone.find(answer=>answer.questionID==this.question.id)
            }

            // проверка на многоответный вопрос + нет сохранённого ответа
            if(
                this.question.multipleAnswers && !answerClone ||
                this.question.multipleAnswers && answerClone.answer!==null && answerClone.isChecked ||
                this.question.multipleAnswers && answerClone.answer===null && answerClone.isChecked
            ){
                console.log('choisedAnswers', this.choisedAnswers)
                //  проверка есть ли ответы
                if(this.choisedAnswers.length){
                    this.giveAnswer(this.question.id, this.choisedAnswers)
                } else if(!this.choisedAnswers.length){
                    this.giveAnswer(this.question.id, null)
                }
            } else if(answerClone && !this.blockSavingProcess){

                console.log('there!1');
                if(
                    this.question.multipleAnswers && answerClone.answer!==null && !answerClone.isChecked ||
                    this.question.multipleAnswers && answerClone.answer===null && !answerClone.isChecked
                ){
                    this.giveAnswer(this.question.id, this.choisedAnswers, true)
                    this.switchAnswerCloneState(this.question.id)
                }
            }

            // if(this.savingsClone.length && !this.blockSavingProcess && !this.switchQuestionStep){
            //     const answerClone = this.savingsClone.find(answer=>answer.questionID==this.question.id)
            //     console.log(1);

            //     if(this.question.multipleAnswers){
            //         if(
            //             answerClone.answer!==null && !answerClone.isChecked ||
            //             answerClone.answer===null && !answerClone.isChecked
            //         ){
            //             this.giveAnswer(this.question.id, this.choisedAnswers, true)
            //             if(!this.answerCloneSwitched){
            //                 this.switchAnswerCloneState(this.question.id)
            //             } else {
            //                 this.switchingAnswerClone()
            //             }
            //         } else{
            //             if(Array.isArray(this.choisedAnswers)){
            //                 if(this.choisedAnswers.length){
            //                     this.giveAnswer(this.question.id, this.choisedAnswers)
            //                 } else {
            //                     this.giveAnswer(this.question.id, null)
            //                 }
            //             }
            //         }
            //     }
            // } else  {
            //      if(!this.switchQuestionStep && !this.blockSavingProcess){
            //          if(this.question.multipleAnswers){
                        
            //             if(Array.isArray(this.choisedAnswers)){
            //                 if(this.choisedAnswers.length){
            //                     this.giveAnswer(this.question.id, this.choisedAnswers)
            //                 } else {
            //                     this.giveAnswer(this.question.id, null)
            //                 }
            //             }
            //          }
            //      }
            //  }
        }
    },
    methods:{
        reset(value){
            if (this.choisedAnswer === value) {
                this.choisedAnswer = null
            }
        },

        switchQuestion(){
            this.randAnswers = undefined
            this.switchQuestionStep = true

            this.question = this.ticket.questions.find(item=>item.id==this.currentQuestion)
            
            if(this.question.type!='question-with-field'){
                this.choisedAnswers = []
                this.choisedAnswer = null
                
                // перемешиваем ответы
                this.randAnswers = this.shakeAnswers(this.question.context.answers)
            
                this.switchQuestionStep = false
            }
            
            // let answerClone
            // // проверка на сохранения
            // if(this.savingsClone.length){
            //     answerClone = this.savingsClone.find(answer=>answer.questionID==this.question.id)
            // }

            // Установка ответов
            const target = this.answers.find(answer=>answer.id==this.question.id)
            
            if(this.question.multipleAnswers){
                if(this.question.type!='question-with-field' && target.answer!==null){
                    this.choisedAnswers = target.answer
                }
            } else{
                if(this.question.type!='question-with-field'){
                    this.choisedAnswer = target.answer
                }
            }

            if(this.question.type=='question-with-field'){

                // проверка сохранений
                let answerClone
                if(this.savingsClone.length){
                    answerClone = this.savingsClone.find(answer=>answer.questionID==this.question.id)
                }
                const fieldAnswer = this.answers.find(a => a.id == this.question.id)
                
                if(!answerClone){
                    this.giveAnswer(this.question.id, fieldAnswer.answer)
                } else if(answerClone && !this.blockSavingProcess) {
                    if(
                        answerClone.answer!==null && !answerClone.isChecked ||
                        answerClone.answer===null && !answerClone.isChecked
                    ) {
                        this.giveAnswer(this.question.id, fieldAnswer.answer, true)
                        this.switchAnswerCloneState(this.question.id)
                    } else if(
                        answerClone.answer!==null && answerClone.isChecked ||
                        answerClone.answer===null && answerClone.isChecked
                    ) {
                        console.log('there');
                        this.giveAnswer(this.question.id, fieldAnswer.answer)
                    }
                }
            }

            // if(answerClone){

            //     if(!this.question.multipleAnswers && answerClone.isChecked && this.question.type!='question-with-field'){
            //         this.giveAnswer(this.question.id, target.answer)
            //     } else if(this.question.multipleAnswers && answerClone.isChecked && this.question.type!='question-with-field'){
            //         this.giveAnswer(this.question.id, target.answer)
            //     }

            // } else {
            //     if(this.question.multipleAnswers){
            //         if(this.question.type!='question-with-field' && target.answer!==null){
            //             this.choisedAnswers = target.answer
            //         }
            //     } else{
            //         if(this.question.type!='question-with-field'){
            //             this.choisedAnswer = target.answer
            //         }
            //     }
            // }

            if(this.question.type=='question-with-field'){
                this.clearMarkers()
                this.summonField()
            }

            this.makeZoom()
        },

        // алгоритм тасования Фишера — Йетса
        shakeAnswers(answers){
            let m = answers.length, t, i;

            // Пока есть элементы для перемешивания
            while (m) {

            // Взять оставшийся элемент
            i = Math.floor(Math.random() * m--);

            // И поменять его местами с текущим элементом
            t = answers[m];
            answers[m] = answers[i];
            answers[i] = t;
            }
            return answers;
        },

        getPosition(){
            // Определение координат клика
            let clickX,clickY = 0
            let field = window.event
        
            if (field.pageX || field.pageY){
                clickX = field.pageX
                clickY = field.pageY
            } else if (field.clientX || field.clientY){
                clickX = field.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
                clickY = field.clientY + document.body.scrollTop + document.documentElement.scrollTop
            }

            // Определение координат элемента
            let target = document.querySelector(`.img_${this.question.id}`)
            let obj = this.getCoords(target)

            const x = clickX - obj.left
            const y = clickY - obj.top

            this.giveAnswer(this.question.id, {x,y})
            this.summonField()
        },

        getCoords(elem) {
            let box = elem.getBoundingClientRect();

            return {
                top: Math.floor(box.top + pageYOffset),
                left: Math.floor(box.left + pageXOffset)
            };
        },

        summonField(){
            if(!document.querySelector(`.img_${this.question.id}`)){
                const watchTarget = setInterval(()=>{
                    if(document.querySelector(`.img_${this.question.id}`)){
                        clearInterval(watchTarget)

                        this.summonFieldFunction()
                    }
                },200)
            } else {
                this.summonFieldFunction()
            }
        },

        summonFieldFunction(){
            const target = document.querySelector(`.img_${this.question.id}`)

            let removeEl = document.querySelectorAll(`.target-${this.question.id}`)
            if(removeEl){
                for(let i = 0; i!=removeEl.length; i++){
                    removeEl[i].remove()
                }
            }

            const answer = this.answers.find(item=>item.id==this.question.id)
            if(answer && answer.answer && answer.answer.x && answer.answer.y && target){
                let field = document.createElement('div')
                field.classList.add(`target-${this.question.id}`)
                field.classList.add(`marker`)
                field.style.padding = '10px'
                field.style.backgroundColor = 'red'
                field.style.opacity = '0.8'
                field.style.position = 'absolute'
                field.style.zIndex = 10
                field.style.top = `${answer.answer.y-10}px`
                field.style.left = `${answer.answer.x-10}px`

                target.appendChild(field)
            }
            
        },

        clearMarkers(){
            let removeEl = document.querySelectorAll(`.marker`)
            if(removeEl){
                for(let i = 0; i!=removeEl.length; i++){
                    removeEl[i].remove()
                }
            }
        }
    },
    mounted(){
        this.switchQuestion()
    }
}
</script>


<style scoped>
.content{
    padding: 30px;
    overflow-y: auto;
    position: relative;
}
.content__main{
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.content__footer{
    position: fixed;
    width: 100%;
    bottom: 50px;
    left: 0;
    display: grid;
    grid-template-columns: 250px auto;
}

.ctx{
    width: 100%;
    border: 1px #888 solid;
    padding: 15px;
    border-radius: 5px;
}

.answers{
    display: grid;
    grid-template-columns: repeat(auto-fill, 47%);
    justify-content: space-between;
    gap: 30px;
    width: 100%;
}

.answer{
    border-left: 1px solid #88888886
}
</style>

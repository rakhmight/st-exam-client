<template>
    <div class="examination" v-if="UIDone && getCurrentTickets">

       <header-component
       :timer="timer"
       :ticket="ticket"
       :answeredQuestions="answeredQuestions"
       :timePoint="timePoint"
       />

        <div class="main">
            
            <sidebar-component
            :ticket="ticket"
            :answers="answers"
            :getExamLanguage="getExamLanguage"
            :currentQuestion="currentQuestion"
            :changeCurrentQuestion="changeCurrentQuestion"
            :answeredQuestions="answeredQuestions"
            :step="step"
            :blockActionBtns="blockActionBtns"
            :sendAnswers="sendAnswers"
            :showResultDialog="showResultDialog"
            :exitExam="exitExam"
            :examResults="examResults"
            :timer="timer"
            />

            <div></div>
            <content-component
            :ticket="ticket"
            :currentQuestion="currentQuestion"
            :getExamLanguage="getExamLanguage"
            :giveAnswer="giveAnswer"
            :answers="answers"
            v-if="step=='exam'"
            :makeZoom="makeZoom"
            :blockSavingProcess="blockSavingProcess"
            :savingsClone="savingsClone"
            :switchAnswerCloneState="switchAnswerCloneState"
            :previewQuestion="previewQuestion"
            :nextQuestion="nextQuestion"
            />

            <div class="pause" v-if="step=='pause'">
                <div style="position: relative;">
                    <div style="position: absolute; overflow: hidden;  top:30px; left: 30px;">
                        <v-img width="90px" src="@/assets/media/pause.png"></v-img>
                    </div>

                    <v-progress-circular
                    :size="150"
                    :width="3"
                    color="var(--main-color)"
                    indeterminate
                    style="overflow: hidden;"
                    ></v-progress-circular>
                </div>
                <span class="mt-7" style="color:#444; text-transform:uppercase; font-weight: 500;">{{ currentLang.examView[0] }}</span>
            </div>

            <div class="stop" v-if="step=='stop'">
                <div>
                    <v-img width="90px" src="@/assets/media/stop.png"></v-img>
                </div>
                <span class="mt-7" style="color:#444; text-transform:uppercase; font-weight: 500;">Administrator stop your exam</span>
            </div>

            <div class="delete-exam" v-if="step=='delete-exam'">
                <div>
                    <v-img width="90px" src="@/assets/media/warning.png"></v-img>
                </div>
                <span class="mt-7" style="color:#444; text-transform:uppercase; font-weight: 500;">Administrator has delete that exam</span>
            </div>
            
            <div class="exclude-exam" v-if="step=='exclude-exam'">
                <div>
                    <v-img width="90px" src="@/assets/media/kick.png"></v-img>
                </div>
                <span class="mt-7" style="color:#444; text-transform:uppercase; font-weight: 500;">Administrator excluded you from the exam</span>
            </div>

            <div class="timeout" v-if="step=='timeout'">
                <div>
                    <v-img width="100px" src="@/assets/media/sandglass.png"></v-img>
                </div>
                <span class="mt-7" style="color:var(--red-color); text-transform:uppercase; font-weight: 500;">{{ currentLang.examView[1] }}</span>
            </div>

            <div class="send" v-if="step=='send'">
                <div style="position: relative;">
                    <div style="position: absolute; overflow: hidden;  top:30px; left: 30px;">
                        <v-img width="90px" src="@/assets/media/send.png"></v-img>
                    </div>

                    <v-progress-circular
                    :size="150"
                    :width="3"
                    color="var(--main-color)"
                    indeterminate
                    style="overflow: hidden;"
                    ></v-progress-circular>
                </div>
                <span class="mt-7" style="color:#444; text-transform:uppercase; font-weight: 500;">{{ currentLang.examView[2] }}</span>
            </div>
        </div>

        <footer-component
        :ticket="ticket"
        :getCurrentExam="getCurrentExam"
        :currentQuestion="currentQuestion"
       />

    </div>
</template>

<script>
import HeaderComponent from '@/components/exam/HeaderComponent.vue';
import FooterComponent from '@/components/exam/FooterComponent.vue';
import SidebarComponent from '@/components/exam/SidebarComponent.vue';
import ContentComponent from '@/components/exam/ContentComponent.vue';
import { mapGetters, mapMutations } from 'vuex';
import makeReq from '@/utils/makeReq';
import path from 'path-browserify'
import { socket } from '@/socket';

export default {
    data(){
        return {
            ticket: null,
            answers: null,
            timer: null,
            UIDone: false,
            currentQuestion: null,
            answeredQuestions: [],
            timePoint: null,
            examResults: undefined,
            userActions: [],
            userTimer: 0,

            // Optional
            timerInterval: undefined,
            step: 'prepare',
            blockActionBtns: false,
            showResultDialog: false,
            currentAnswer: 0,
            windowsIncrease: 1,
            actionsSaveWorker: undefined,
            allowPass: true,
            startTime: undefined,
            savingAvaible: undefined,
            blockSavingProcess: true,
            savingsClone: [],
            exitClaim: false,
            
            blockSend: false
        }
    },
    computed: mapGetters(['getAuthState', 'getExamState', 'getCurrentTickets', 'getCurrentExam', 'getExamLanguage', 'getExamServerIP', 'getExamToken', 'getCurrentExamID', 'getUserData', 'getCurrentSaving', 'getSavesCounter', 'getAdminServerIP', 'getExams', 'getCurrentModuleExam', 'getCurrentExamsList', 'currentLang']),
    components: {
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
        ContentComponent
    },
    mounted(){
        if(!this.getAuthState || !this.getCurrentTickets || !this.getExamState || !this.getExamLanguage){
            this.$router.push('/')
        }

        // Запускаем воркер сохранения действий экзаменуемого
        if (window.Worker && this.getExamState) {
            this.actionsSaveWorker = new Worker(path.join(process.env.BASE_URL, 'workers', 'actionsSaveWorker.js'));

            // прослушиваем события с воркера
            this.actionsSaveWorker.onmessage = (event) => {
                const workerData = event.data
                console.log(workerData);

                // if(workerData.type=='check-saving-exist'){

                //     if(workerData.saving!==null){
                //         console.log(1);
                //         this.setCurrentSaving(workerData.saving.id)
                //         this.userActions.push(...workerData.saving.actions)
                //         this.savingAvaible = true
                //         console.log(workerData);
                //     } else if(workerData.saving === null) {
                //         this.savingAvaible = false
                //         console.log(2);
                //     }
                    
                //     this.beginExam()
                // }
            }
        } else if(!window.Worker){
            //
            console.error('[Web-workers] This device not support web-workers')
        }

        if(this.getAuthState && this.getCurrentTickets && this.getExamState && this.getExamLanguage){
            this.prepareProcess()
            console.log('prepareProcess');
        }

        // прослушивание клавиш
        document.addEventListener('keydown', this.handleKeyDown);

        // прослушивание сокетов
        socket.on(`client-pause-${this.getUserData.authData.id}`, ()=>{
            this.actionHandler('paused')
        })

        socket.on(`client-resume-${this.getUserData.authData.id}`, ()=>{
            this.actionHandler('resumed')
        })

        socket.on(`client-stop-${this.getUserData.authData.id}`, ()=>{
            this.actionHandler('stop')
        })

        socket.on(`client-change-question-${this.getUserData.authData.id}`, (data) => {
            this.changeQuestion(data.examData)
        })

        socket.on(`client-delete-exam-${this.getUserData.authData.id}`,() => {
            this.actionHandler('delete-exam')
        })

        socket.on(`client-exclude-${this.getUserData.authData.id}`,() => {
            this.actionHandler('exclude-exam')
        })

    },
    methods:{
        ...mapMutations(['setCurrentTickets', 'setCurrentExam', 'setCurrentExamID', 'setCurrentExamsList', 'setExamLanguage', 'setExamState', 'setCurrentSaving', 'updateSavesCounter', 'setCurrentModuleExam', 'updateCurrentExamsList', 'setUserData', 'setAuthState', 'setExamToken']),

        changeQuestion(data){
            if(this.ticket.questions.find(question => question.id == data.questionID)!=-1){

                // Подставление вопроса в ticket.questions из ticket.additionalQuestions
                const injectedQuestion = this.ticket.additionalQuestions.shift()
                this.ticket.questions.push(injectedQuestion)

                // Добавление данных в answers
                const injectedAnswer = {
                        id: injectedQuestion.id,
                        answer: null
                }
                this.answers.push(injectedAnswer)

                // Удаление заменяемого вопроса из ticket.questions, answers, answeredQuestion
                const targetQ = this.ticket.questions.find(question => question.id == data.questionID)
                const indexQ = this.ticket.questions.indexOf(targetQ)
                console.log(this.ticket.questions);

                if(this.currentQuestion == data.questionID){
                    this.nextQuestion()
                }

                this.ticket.questions.splice(indexQ, 1)
                console.log(this.ticket.questions);

                const targetA = this.answers.find(answer => answer.id == data.questionID)
                const indexA = this.answers.indexOf(targetA)
                this.answers.splice(indexA, 1)

                if(this.answeredQuestion){
                    if(this.answeredQuestion.find( aq => aq == data.questionID)!=-1){
                        const targetAQ = this.answeredQuestion.find( aq => aq == data.questionID)
                        const indexAQ = this.answeredQuestion.indexOf(targetAQ)
                        this.answeredQuestion.splice(indexAQ, 1)
                    }
                }

                // добавление истории действий
                this.userActions.push({ actType: 'change-question', ctx: { timestamp: Date.now(), changedQuestion: data.questionID, injectedQuestion: injectedQuestion.id }})
                this.actionsSaveWorker.postMessage(JSON.parse(JSON.stringify(
                    {
                        type: 'putSaving',
                        ctx: {
                            id: this.getCurrentSaving,
                            data: {
                                id: this.getCurrentSaving,
                                userID: this.getUserData.authData.id,
                                examID: this.getCurrentExamID,
                                actions: this.userActions,
                                ticket: this.ticket.ticketNumber,
                                subject: this.ticket.subject,
                                startTime: this.startTime,
                                residualTime: this.timer
                            }
                        }
                    }
                )))
            }
        },

        switchAnswerCloneState(questionID){
            console.log('Switch cheking');
            const target = this.savingsClone.find(clone=>clone.questionID == questionID)
            const index = this.savingsClone.indexOf(target)
            this.savingsClone[index].isChecked = true

            console.log(this.savingsClone);
        },

        prepareProcess(){
            // подготовка билета
            if(!this.getCurrentTickets){
                this.$router.push('/')
            }

            const currentmoduleEx = this.getCurrentTickets.find(ct => ct.subject == this.getCurrentModuleExam.subject) 
            this.ticket = currentmoduleEx

            const currentExam = this.getExams.find(ex => ex.id==this.getCurrentExamID)

            if(currentExam && currentExam.userAttempts){
                const currentModuleEx = currentExam.userAttempts.find(attempt => attempt.subject==this.ticket.subject)

                if(currentModuleEx){
                    this.savingAvaible = {
                        actions: currentModuleEx.attempts.actions,
                        startDate: currentModuleEx.attempts.date.start,
                        residualTime: currentModuleEx.attempts.residualTime
                    }

                    this.userActions = currentModuleEx.attempts.actions
                }
            }
            
            // подготовка листа ответов
            const answersPrepare = this.ticket.questions.map(question =>{
                return {
                    id: question.id,
                    answer: null
                }
            })

            if(this.savingAvaible){
                this.savingAvaible.actions.forEach((action, i)=>{
                    if(action.actType=='answering' && i != 0){
                        const target = answersPrepare.find(answer => answer.id == action.ctx.currentQuestion)
                        const index = answersPrepare.indexOf(target)

                        if(action.ctx.answer!==null){

                            answersPrepare[index].answer = JSON.parse(JSON.stringify(action.ctx.answer))
                        }
                    }
                })

                answersPrepare.forEach(answer=>{
                    console.log(answer);
                    const clone = {
                        questionID: answer.id,
                        isChecked: answer.answer===null ? true : false,
                        answer: answer.answer
                    }

                    this.savingsClone.push(clone)

                    if(answer.answer!==null){
                        this.answeredQuestions.push(answer.id)
                    }
                })
                
                console.log(this.savingsClone);
                
                this.actionsSaveWorker.postMessage(JSON.parse(JSON.stringify(
                    {
                        type: 'addSaving',
                        ctx: {
                            data: {
                                id: this.getSavesCounter,
                                userID: this.getUserData.authData.id,
                                examID: this.getCurrentExamID,
                                actions: this.savingAvaible.actions,
                                ticket: this.ticket.ticketNumber,
                                subject: this.ticket.subject,
                                startTime: this.savingAvaible.startDate,
                                residualTime: this.timer
                            }
                        }
                    }
                )))

                this.updateSavesCounter(this.getSavesCounter)
            }

            this.answers = answersPrepare

            console.log(this.answers);

            // подготовка таймера
            if(this.getCurrentModuleExam.params.examTime!==null){
                this.timer = this.getCurrentModuleExam.params.examTime*60
                this.timePoint = 100/this.timer
            } else {
                this.timer = null
            }

            // подготовка currentQuestion
            if(!this.savingAvaible){
                this.currentQuestion = this.ticket.questions[0].id
            }

            // показ UI
            this.UIDone = true

            if(this.getCurrentExam.userStatus == 'paused'){
                this.actionHandler('paused')
            } else {
                this.step = 'exam'
                this.beginExam()
            }

            // Проверка в Local DB на текущий процесс
            // this.actionsSaveWorker.postMessage(JSON.parse(JSON.stringify(
            //     {
            //         type: 'check-saving-exist',
            //         ctx: {
            //             userID: this.getUserData.id,
            //             examID: this.getCurrentExamID,
            //         }
            //     }
            // )))

            // После ответа beginExam()
            this.blockSavingProcess = false

            if(this.savingAvaible){
                if(!this.getCurrentModuleExam.params.changeAnswerPossibility){
                    let nextQuestion

                    for(let i = 0; i!=this.ticket.questions.length-1; i++){
                        const answerTarget = this.answers.find(answer=>answer.id==this.ticket.questions[i].id)

                        if(answerTarget.answer===null){
                            nextQuestion = this.ticket.questions[i].id
                            break
                        }
                    }

                    if(nextQuestion){
                        this.currentQuestion = nextQuestion
                    } else {
                        this.sendAnswers('send')
                    }
                } else {
                    this.currentQuestion = this.ticket.questions[0].id
                }
            }
        },

        async actionHandler(type, ctx){
            if(type=='start'){
                    // Если нет сохранения данного процесса
                    if(!this.savingAvaible){
                        this.userActions.push({actType: type, ctx})
                        this.actionsSaveWorker.postMessage(JSON.parse(JSON.stringify(
                            {
                                type: 'addSaving',
                                ctx: {
                                    data: {
                                        id: this.getSavesCounter,
                                        userID: this.getUserData.id,
                                        examID: this.getCurrentExamID,
                                        actions: this.userActions,
                                        ticket: this.ticket.ticketNumber,
                                        subject: this.ticket.subject,
                                        startTime: this.startTime,
                                        residualTime: this.timer
                                    }
                                }
                            }
                        )))

                        this.updateSavesCounter(this.getSavesCounter)
                    }
                    
            } else if(type=='answering'){
                    if(this.userActions[this.userActions.length-1] && this.userActions[this.userActions.length-1].ctx.currentQuestion == this.currentQuestion){
                        const question = this.ticket.questions.find(item=>item.id==this.currentQuestion)
                        // if(this.userActions[this.userActions.length-1].ctx.answer && !question.multipleAnswers){
                        //     this.userActions.push({actType: type, ctx})
                        // } else
                        if(
                            this.userActions[this.userActions.length-1].ctx.answer && !question.multipleAnswers ||
                            !this.userActions[this.userActions.length-1].ctx.answer && !question.multipleAnswers ||
                            !this.userActions[this.userActions.length-1].ctx.answer && question.multipleAnswers ||
                            this.userActions[this.userActions.length-1].ctx.answer && question.multipleAnswers
                        ){
                            this.userActions[this.userActions.length-1].ctx.answer = ctx.answer
                            
                            // TODO: отправка сохранений
                            await makeReq(`${this.getAdminServerIP}/api/exams/saving-update`, 'POST', {
                                auth: {
                                    id: this.getUserData.authData.id,
                                    token: this.getUserData.authData.token.key,
                                },
                                saving: {
                                    id: this.getCurrentSaving,
                                    userID: this.getUserData.authData.id,
                                    examID: this.getCurrentExamID,
                                    actions: this.userActions,
                                    ticket: this.ticket.ticketNumber,
                                    subject: this.ticket.subject,
                                    startTime: this.startTime,
                                    residualTime: this.timer
                                }
                            })
                            .then(data=>{
                                console.log(data)
                            })
                            .catch(error => {
                                console.error(error);
                            })
                            
                        }
                    } else {
                        this.userActions.push({actType: type, ctx})
                    }

                    this.actionsSaveWorker.postMessage(JSON.parse(JSON.stringify(
                        {
                            type: 'putSaving',
                            ctx: {
                                id: this.getCurrentSaving,
                                data: {
                                    id: this.getCurrentSaving,
                                    userID: this.getUserData.authData.id,
                                    examID: this.getCurrentExamID,
                                    actions: this.userActions,
                                    ticket: this.ticket.ticketNumber,
                                    subject: this.ticket.subject,
                                    startTime: this.startTime,
                                    residualTime: this.timer
                                }
                            }
                        }
                    )))

            }else if(type == 'paused'){
                this.step = 'pause'
                if(this.timerInterval){
                    clearInterval(this.timerInterval)
                    this.timerInterval = undefined
                }

                this.userActions.push({ actType: type, ctx: { timestamp: Date.now() }})
                this.actionsSaveWorker.postMessage(JSON.parse(JSON.stringify(
                    {
                        type: 'deleteSaving',
                        ctx: {
                            id: this.getCurrentSaving
                        }
                    }
                )))
                
                // TODO: отправка сохранений
                if(this.getUserData.authData){
                    await makeReq(`${this.getAdminServerIP}/api/exams/saving-update`, 'POST', {
                        auth: {
                            id: this.getUserData.authData.id,
                            token: this.getUserData.authData.token.key,
                        },
                        saving: {
                            id: this.getCurrentSaving,
                            userID: this.getUserData.authData.id,
                            examID: this.getCurrentExamID,
                            actions: this.userActions,
                            ticket: this.ticket.ticketNumber,
                            subject: this.ticket.subject,
                            startTime: this.startTime,
                            residualTime: this.timer
                        }
                    })
                    .then(data=>{
                        console.log(data);
                        if(this.timerInterval){
                            clearInterval(this.timerInterval)
                            this.timerInterval = undefined
                        }
                        setTimeout(() => this.exitExam(true), 5000)
                    })
                    .catch(error => {
                        console.error(error);
                    })
                }

            }else if(type == 'resumed'){
                // this.step = 'exam'
                // if(!this.timerInterval){
                //     if(this.timer!==null){
                //         this.timerInterval = setInterval(()=>{
                //             if(this.timer!=0){
                //                 this.timer-=1
                //             } else {
                //                 //! ОТПРАВКА
                //                 this.sendAnswers('timeout')
                //             }
                //         },1000)
                //     }
                    
                //     this.userActions.push({ actType: type, ctx: { timestamp: Date.now() }})
                //     this.actionsSaveWorker.postMessage(JSON.parse(JSON.stringify(
                //         {
                //             type: 'putSaving',
                //             ctx: {
                //                 id: this.getCurrentSaving,
                //                 data: {
                //                     id: this.getCurrentSaving,
                //                     userID: this.getUserData.authData.id,
                //                     examID: this.getCurrentExamID,
                //                     actions: this.userActions,
                //                     ticket: this.ticket.ticketNumber,
                //                     subject: this.ticket.subject,
                //                     startTime: this.startTime,
                //                     residualTime: this.timer
                //                 }
                //             }
                //         }
                //     )))
                // }

            }else if(type=='finish'){
                this.userActions.push({actType: type, ctx})
                this.actionsSaveWorker.postMessage(JSON.parse(JSON.stringify(
                    {
                        type: 'putSaving',
                        ctx: {
                            data: {
                                id: this.getSavesCounter,
                                userID: this.getUserData.authData.id,
                                examID: this.getCurrentExamID,
                                actions: this.userActions,
                                ticket: this.ticket.ticketNumber,
                                subject: this.ticket.subject,
                                startTime: this.startTime,
                                residualTime: this.timer
                            }
                        }
                    }
                )))
            }else if(type == 'stop'){
                this.step = 'stop'
                this.blockSend = true
                this.blockActionBtns = true
                
                this.actionsSaveWorker.postMessage(JSON.parse(JSON.stringify(
                    {
                        type: 'deleteSaving',
                        ctx: {
                            id: this.getCurrentSaving
                        }
                    }
                )))

                if(this.timerInterval){
                    clearInterval(this.timerInterval)
                    this.timerInterval = undefined
                }
                setTimeout(() => this.exitExam(true), 7000)
            }else if(type == 'delete-exam'){
                this.step = 'delete-exam'
                this.blockSend = true
                this.blockActionBtns = true
                if(this.timerInterval){
                    clearInterval(this.timerInterval)
                    this.timerInterval = undefined
                }
                setTimeout(() => this.exitExam(true), 7000)
            } else if(type == 'exclude-exam'){
                this.step = 'exclude-exam'
                this.blockSend = true
                this.blockActionBtns = true
                if(this.timerInterval){
                    clearInterval(this.timerInterval)
                    this.timerInterval = undefined
                }
                setTimeout(() => this.exitExam(true), 7000)
            }
        },

        async beginExam(){
            if(this.savingAvaible){
                this.startTime = this.savingAvaible.startDate
            } else {
                this.startTime = Date.now()
            }
            // Начало отсчёта времени (+уведомление сервера)

            socket.emit('client-exam-additional', {
                examID: this.getCurrentExamID,
                userID: this.getUserData.authData.id,
                subject: this.ticket.subject,
                time: {
                    start: Date.now(),
                    value: this.savingAvaible && this.savingAvaible.actions.length ? this.savingAvaible.residualTime : this.getCurrentModuleExam.params.examTime*60
                },
                type: 'additional'
            })

            if(!this.savingAvaible){
                this.actionHandler('start', { timestamp: this.startTime })
                this.actionHandler('answering', { timestamp: this.startTime, currentQuestion: this.currentQuestion, answer: null })

                await makeReq(`${this.getAdminServerIP}/api/exams/startexam`, 'POST', {
                    auth: {
                        id: this.getUserData.authData.id,
                        token: this.getUserData.authData.token.key,
                    },
                    data: {
                        examID: this.getCurrentExamID,
                        subject: this.ticket.subject,
                        startTime: this.startTime,
                        ticket: this.ticket.ticketNumber
                    }
                })
                .then(data=>{
                    if(data.statusCode == 200){
                        console.info(`[i] Exam started (ID: ${this.getCurrentExamID}, subject: ${this.ticket.subject}, timestamp: ${this.startTime})`);
                    } else {
                    console.error(`[ST-Admin] Error when saving start time`)
                    }
                })
                .catch(error=>{
                    console.error(error)
                })
            } else {
                console.info(`[i] Exam resume (ID: ${this.getCurrentExamID}, subject: ${this.ticket.subject}, timestamp: ${this.startTime})`);

                if(this.savingAvaible.actions.length){
                    this.timer = this.savingAvaible.residualTime
                }
            }
            
            // Отсчёт времени
            if(this.timer!==null){
                this.timerInterval = setInterval(()=>{
                    if(this.timer!=0){
                        this.timer-=1
                    } else {
                        //! ОТПРАВКА
                        this.sendAnswers('timeout')
                    }
                },1000)
            }
        },

        checkQuestion(id, mode){
            // const answerTarget = this.answers.find(answer=>answer.id==id)
            // const answerIndex = this.answers.indexOf(answerTarget)
            let nextQuestion = null
            
            const questionsTarget = this.ticket.questions.find(item=>item.id==id)
            const questionIndex = this.ticket.questions.indexOf(questionsTarget)

            
            if(mode=='next'){
                for(let i = questionIndex; i!=this.ticket.questions.length; i++){
                    const answerTarget = this.answers.find(answer=>answer.id==this.ticket.questions[i].id)

                    console.log('answerTarget', answerTarget);

                    if(answerTarget.answer===null){
                        nextQuestion = this.ticket.questions[i].id
                        break
                    }
                }
            } else if(mode == 'preview'){
                for(let i = questionIndex; i!=0; i--){
                    const answerTarget = this.answers.find(answer=>answer.id==this.ticket.questions[i].id)

                    if(answerTarget.answer===null){
                        nextQuestion = this.ticket.questions[i].id
                        break
                    }
                }
            }

            if(!nextQuestion){
                if(mode=='next'){
                    for(let i = 0; i!=questionIndex; i++){
                        const answerTarget = this.answers.find(answer=>answer.id==this.ticket.questions[i].id)

                        if(answerTarget.answer===null){
                            nextQuestion = this.ticket.questions[i].id
                            break
                        }
                    }
                } else if(mode == 'preview'){
                    for(let i = this.ticket.questions.length-1; i!=questionIndex; i--){
                        const answerTarget = this.answers.find(answer=>answer.id==this.ticket.questions[i].id)

                        if(answerTarget.answer===null){
                            nextQuestion = this.ticket.questions[i].id
                            break
                        }
                    }
                }
            }

            return nextQuestion
        },

        changeCurrentQuestion(id, mode){

            const answerTarget = this.answers.find(answer=>answer.id==id)
            const answerIndex = this.answers.indexOf(answerTarget)

            if(!this.getCurrentModuleExam.params.changeAnswerPossibility && mode){
                let nextQuestion = this.checkQuestion(id, mode)
                if(nextQuestion!==null){
                    this.currentQuestion = nextQuestion
                    this.currentAnswer = 0

                    //
                    if(this.answers[answerIndex].answer===null && this.currentQuestion==nextQuestion){
                        this.actionHandler('answering', { timestamp: Date.now(), currentQuestion: this.currentQuestion, answer: null })
                    }
                } else if(nextQuestion===null){
                    this.sendAnswers('send')
                }
            }else if(!this.getCurrentModuleExam.params.changeAnswerPossibility && !mode){
                
                const answerTarget = this.answers.find(answer=>answer.id==id)
                if(answerTarget.answer===null){
                    this.currentQuestion = id
                    this.currentAnswer = 0

                    //
                    if(this.answers[answerIndex].answer===null && this.currentQuestion==id){
                        this.actionHandler('answering', { timestamp: Date.now(), currentQuestion: this.currentQuestion, answer: null })
                    }
                }

            }else if(this.getCurrentModuleExam.params.changeAnswerPossibility) {
                this.currentQuestion = id
                this.currentAnswer = 0

                //
                if(this.answers[answerIndex].answer===null && this.currentQuestion==id){
                    this.actionHandler('answering', { timestamp: Date.now(), currentQuestion: this.currentQuestion, answer: null })
                }
                //this.focusedOnAnswer()
            }
        },

        giveAnswer(questionID, answer, isSilent){
            if(!this.blockSavingProcess){
                const target = this.answers.find(answer=>answer.id==questionID)
                const index = this.answers.indexOf(target)
                this.answers[index].answer = answer
                //console.log(this.answers);
                
                if(answer!==null && !isSilent){
                    this.actionHandler('answering', { timestamp: Date.now(), currentQuestion: questionID, answer })
                }

                const item = this.answeredQuestions.indexOf(this.answers[index].id)
                if(this.answers[index].answer && item==-1){
                    this.answeredQuestions.push(this.answers[index].id)
                }

                console.log(item);
                console.log(this.answers[index].answer);
                if(!this.answers[index].answer && item!=-1){
                    this.answeredQuestions.splice(item, 1)
                }

                if(!this.getCurrentModuleExam.params.changeAnswerPossibility){
                    const questionTarget = this.ticket.questions.find(q => q.id == questionID)
                    if(this.answeredQuestions.length == this.answers.length && !questionTarget.multipleAnswers){
                        this.sendAnswers('send')
                    }
                }
            }
        },

        async sendAnswers(step){
            if(!this.blockSend){

                // block send
                this.blockSend = true

                // остановка времени
                const stopTime = Date.now()

                // Добавление в userActions
                this.actionHandler('finish', { timestamp: stopTime })

                this.clearAllProcess()
                this.blockActionBtns = true

                if(step=='send'){
                    this.step='send'
                    console.log('Send!');
                } else if(step=='timeout'){
                    this.step = 'timeout'
                    console.log('Time over!');
                }

                setTimeout(async ()=>{
                    // запуск модального окна
                    this.showResultDialog = true
                },1000)            

                // отправка ответа на сервер
                await makeReq(`${this.getExamServerIP}/api/exam/handlework`, 'POST', {
                    auth: {
                        id: this.getUserData.authData.id,
                        token: this.getExamToken,
                    },
                    exam: {
                        examID: this.getCurrentExamID,
                        answers: this.answers,
                        isComplex: this.getCurrentExam.isComplex,
                        subject: this.ticket.subject,
                        ticketID: this.ticket.ticketNumber
                    }
                })
                .then(async (data)=>{
                    console.log(data);
                    this.examResults = data.data.result

                    // Отправка результатов в админ сервер
                    await makeReq(`${this.getAdminServerIP}/api/exams/finishexam`, 'POST', {
                        auth: {
                            id: this.getUserData.authData.id,
                            token: this.getUserData.authData.token.key,
                        },
                        data:{
                            exam:{
                                examID: this.getCurrentExamID,
                                subject: this.ticket.subject,
                                residualTime: this.timer,
                                startTime: this.startTime
                            },
                            results: data.data.result,
                            actions: this.userActions
                        }
                    })
                    .then((response)=>{
                        // удаление сохранения
                        this.actionsSaveWorker.postMessage(JSON.parse(JSON.stringify(
                            {
                                type: 'deleteSaving',
                                ctx: {
                                    id: this.getCurrentSaving
                                }
                            }
                        )))
                        console.log(response);
                    })

                })
                .then(()=>{
                    if(this.getCurrentModuleExam.params.showResults && this.getCurrentModuleExam.params.resultDisplayTime !== null && typeof this.getCurrentModuleExam.params.resultDisplayTime == 'number'){
                        setTimeout(()=>{
                            this.exitExam()
                        }, this.getCurrentModuleExam.params.resultDisplayTime * 1000)
                    }

                    if(!this.getCurrentModuleExam.params.showResults) this.exitExam()
                })
                .catch(error=>{
                    console.error(error)
                })
        
            }
        },

        exitExam(isStopping){
            if(!this.exitClaim){
                // работа с комплексом экзаменов
                console.log(this.getCurrentExamsList);
                if(this.getCurrentExamsList && !isStopping) {

                    console.log('checking next module');
                    this.setExamState(false)
                    this.setExamLanguage(undefined)
                    this.clearAllProcess()
                    
                    this.updateCurrentExamsList(this.getCurrentModuleExam.subject)

                    const nextModuleExam = this.getCurrentExamsList.find(me => me.isPassed==false)

                    if(nextModuleExam){
                        const moduleExam = this.getCurrentExam.complex.find(ce => ce.subject==nextModuleExam.subject)
                        this.setCurrentModuleExam(moduleExam)
                        this.$router.push('/prepare')
                    } else {
                        this.setCurrentExam(undefined)
                        this.setCurrentExamID(undefined)
                        this.setCurrentTickets(undefined)
                        this.setCurrentExamsList(undefined)
                        this.setCurrentModuleExam(undefined)
                        this.setUserData(undefined)
                        this.setAuthState(false)
                        this.setExamToken(undefined)
                        this.$router.push('/auth')
                    }
                } else {
                            
                    this.setExamState(false)
                    this.setExamLanguage(undefined)
                    this.setCurrentExamsList(undefined)
                    this.setCurrentExamID(undefined)
                    this.setCurrentExam(undefined)
                    this.setCurrentTickets(undefined)
                    this.setUserData(undefined)
                    this.setAuthState(false)
                    this.setExamToken(undefined)
                    this.$router.push('/auth')
                
                    this.clearAllProcess()
                }
            }

            this.exitClaim = true
        },

        handleKeyDown(event){
            event.preventDefault()
            //console.log(event);

            if(event.code=='ArrowLeft'){
                this.previewQuestion()
            } else if(event.code=='ArrowRight'){
                this.nextQuestion()
            } else if(event.code=='ArrowUp'){
                this.nextAnswer()
            } else if(event.code=='ArrowDown'){
                this.previewAnswer()
            } else if(event.code == 'Space' || event.code == 'Numpad0'){
                this.clickToAnswer()
            } else if(event.code=='NumpadAdd'){
                this.zoomWindow('out')
            } else if(event.code=='NumpadSubtract'){
                this.zoomWindow('in')
            }
        },

        nextQuestion(){
            if(this.allowPass){
                this.allowPass = false

                const currentQ = this.ticket.questions.find(item=>item.id==this.currentQuestion)
                const currentQI = this.ticket.questions.indexOf(currentQ)

                let nexQuestion
                if(this.ticket.questions[currentQI+1]){
                    nexQuestion = this.ticket.questions[currentQI+1].id
                } else {
                    nexQuestion = this.ticket.questions[0].id
                }

                this.changeCurrentQuestion(nexQuestion, 'next')

                // Проверка в сохранённой работе
                // if(this.savingsClone.length){
                //     const answerClone = this.savingsClone.find(answer=>answer.questionID==nexQuestion)
                //     if(
                //         answerClone.answer!==null && !answerClone.isChecked ||
                //         answerClone.answer===null && !answerClone.isChecked
                //     ){
                //         this.switchAnswerCloneState(nexQuestion)
                //         this.answerCloneSwitched = true
                //     } else if(
                //         answerClone.answer!==null && answerClone.isChecked ||
                //         answerClone.answer===null && answerClone.isChecked
                //     ){
                //         this.actionHandler('answering', { timestamp: Date.now(), currentQuestion: nexQuestion, answer: null })
                //     }
                // }

                setTimeout(()=>{
                    this.allowPass = true
                },200)
            }
        },

        previewQuestion(){
            if(this.allowPass){
                this.allowPass = false

                const currentQ = this.ticket.questions.find(item=>item.id==this.currentQuestion)
                const currentQI = this.ticket.questions.indexOf(currentQ)

                let previewQuestion
                
                if(this.ticket.questions[currentQI-1]){
                    previewQuestion = this.ticket.questions[currentQI-1].id
                } else {
                    previewQuestion = this.ticket.questions[this.ticket.questions.length-1].id
                }

                this.changeCurrentQuestion(previewQuestion, 'preview')

                // Проверка в сохранённой работе
                // if(this.savingsClone.length){
                //     const answerClone = this.savingsClone.find(answer=>answer.questionID==previewQuestion)
                //     if(
                //         answerClone.answer!==null && !answerClone.isChecked ||
                //         answerClone.answer===null && !answerClone.isChecked
                //     ){
                //         this.switchAnswerCloneState(previewQuestion)
                //         this.answerCloneSwitched = true
                //     } else if(
                //         answerClone.answer!==null && answerClone.isChecked ||
                //         answerClone.answer===null && answerClone.isChecked
                //     ){
                //         this.actionHandler('answering', { timestamp: Date.now(), currentQuestion: previewQuestion, answer: null })
                //     }
                // }

                setTimeout(()=>{
                    this.allowPass = true
                },200)
            }
        },

        nextAnswer(){
            const currentQ = this.ticket.questions.find(item=>item.id==this.currentQuestion)
            if(currentQ.type=='basic-question' || currentQ.type=='question-with-images'){
                const currentQAnswers = currentQ.context.answers

                if(currentQAnswers[this.currentAnswer+1]){
                    this.currentAnswer = this.currentAnswer+1
                } else {
                    this.currentAnswer = 0
                }

                this.focusedOnAnswer(currentQ.multipleAnswers)

            }
        },

        previewAnswer(){
            const currentQ = this.ticket.questions.find(item=>item.id==this.currentQuestion)
            if(currentQ.type=='basic-question' || currentQ.type=='question-with-images'){
                const currentQAnswers = currentQ.context.answers

                if(currentQAnswers[this.currentAnswer-1]){
                    this.currentAnswer = this.currentAnswer-1
                } else {
                    this.currentAnswer = currentQAnswers.length-1
                }

                this.focusedOnAnswer(currentQ.multipleAnswers)

            }
        },

        clickToAnswer(){
            const answerDiv = document.querySelector(`.answer-${this.currentAnswer}`)
            if(answerDiv){
                const answer = answerDiv.querySelector('input')
                answer.click()
            }
        },

        focusedOnAnswer(){
            const answerDiv = document.querySelector(`.answer-${this.currentAnswer}`)
            if(answerDiv){
                const answer = answerDiv.querySelector('input')
                answer.focus()

                // if(!multiple){
                //     answer.click()
                // }
            }
        },

        zoomWindow(type){
            if(type=='in'){
                if(this.windowsIncrease-0.1>=1){
                    this.windowsIncrease = this.windowsIncrease - 0.1
                }
            } else if(type=='out'){
                if(this.windowsIncrease+0.1<=1.5){
                    this.windowsIncrease = this.windowsIncrease + 0.1
                }
            }            

            this.makeZoom()
        },

        makeZoom(){
            ['answers', 'exam-content'].forEach(item=>{
                if(!document.querySelector(`.${item}`)){
                    const watchTarget = setInterval(()=>{
                        if(document.querySelector(`.${item}`)){
                            clearInterval(watchTarget)

                            this.makeZoomFunction(document.querySelector(`.${item}`))
                        }
                    },100)
                } else {
                    this.makeZoomFunction(document.querySelector(`.${item}`))
                }
            })
        },

        makeZoomFunction(target){
            target.style.fontSize = `${this.windowsIncrease}em`
        },

        clearAllProcess(){
            if(this.timer!==null && this.timerInterval){
                clearInterval(this.timerInterval)
            }

            document.removeEventListener('keydown', this.handleKeyDown); // удаление обработчика

            // удаление worker
            if(this.actionsSaveWorker){
                this.actionsSaveWorker.terminate()
            }
        }
    },
    unmounted(){
        this.clearAllProcess()
    }
}
</script>


<style scoped>
::-webkit-scrollbar {
    width: 6px;
    display: block
}
.examination{
    width: 100%;
    position: relative;
    height: 100vh;
}

.main{
    width: 100%;
    position: relative;
    height: 100%;
    padding: 70px 0 40px;
    display: grid;
    grid-template-columns: 250px auto;
}

.pause, .timeout, .send, .stop, .delete-exam, .exclude-exam{
    width: 100%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
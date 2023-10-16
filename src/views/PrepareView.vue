<template>
    <div class="wrapper">
        <div class="form" v-if="getCurrentTickets && getCurrentExam">
            <div class="form__header">
                <div>
                    <v-tooltip text="Tooltip">
                        <template v-slot:activator="{ props }">                                
                            <span v-bind="props" style="font-size: 0.9em; color: #888">{{ getCurrentExam.complex.length>1 ? currentLang.prepareView[0] : currentLang.prepareView[1] }}</span>
                        </template>
                        <span>{{ getCurrentExam.complex.length>1 ? currentLang.prepareView[0] : currentLang.prepareView[1] }}</span>
                    </v-tooltip>
                </div>

                <div style="gap: 20px; display: grid; grid-template-columns: repeat(3, 1fr);">
                    <div style="display: grid; grid-template-columns: 20px auto; justify-content: start;">
                        <div><v-icon size="18" color="var(--main-color)">mdi-alpha-s-box-outline</v-icon></div>
                        <div style="max-width: 300px;" class="lim-txt">
                            <span>{{ currentLang.prepareView[2] }}: <span style="color: var(--main-color)">{{ getCurrentModuleExam ? getSubjectName(getCurrentModuleExam.subject) : getSubjectName(getCurrentExam.complex[0].subject) }}</span></span>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 20px auto; justify-content: center;">
                        <div><v-icon size="18" color="var(--main-color)">mdi-alarm</v-icon></div>
                        <div>
                            <span>{{ currentLang.prepareView[3] }}: <span style="color: var(--main-color)">{{ getCurrentModuleExam ? `${getCurrentModuleExam.params.examTime} ${currentLang.prepareView[4]}` : getCurrentExam.complex[0].params.examTime===null ? currentLang.prepareView[5] : `${getCurrentExam.complex[0].params.examTime} ${currentLang.prepareView[4]}` }}</span></span>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 20px auto; justify-content: end;">
                        <div><v-icon size="18" color="var(--main-color)">mdi-ticket-confirmation-outline</v-icon></div>
                        <div>
                            <span>{{ currentLang.prepareView[6] }}: <span style="color: var(--main-color)">{{ getCurrentModuleExam ? getTicketsCount() : getCurrentTickets[0].ticketNumber }}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            <v-divider class="mt-3 mb-3"></v-divider>

            <div class="form__content">
                <div class="languages" v-if="step=='choise-lang'">
                    <div style="flex: 1 1 auto;" class="d-flex justify-center flex-column">
                        <div>
                            <div class="d-flex justify-center"><span style="color:var(--special-color); font-size: 1.2em;">{{ currentLang.prepareView[7] }}</span></div>

                            <div style="width: 100%; margin-top: 30px;">
                                <v-radio-group v-model="language" density="compact" color="var(--main-color)">
                                    <div class="langs">
                                        <div
                                        v-for="(lang, i) in getCurrentExam.complex[0].params.languages"
                                        :key="i"
                                        class="d-flex align-center"
                                        >
                                            <div style="width: 30px;">
                                                <v-img v-if="lang=='ru'" src="@/assets/media/russia.png"></v-img>
                                                <v-img v-if="lang=='eng'" src="@/assets/media/united-states.png"></v-img>
                                                <v-img v-if="lang=='custom'" src="@/assets/media/global.png"></v-img>
                                                <v-img v-if="lang=='uz_k' || lang=='uz_l'" src="@/assets/media/uzbekistan.png"></v-img>
                                                <v-img v-if="lang=='de'" src="@/assets/media/germany.png"></v-img>
                                                <v-img v-if="lang=='fr'" src="@/assets/media/france.png"></v-img>
                                            </div>
                                            <v-radio
                                            :label="`(${getLanguageName(lang)})`"
                                            :value="lang"
                                            class="ml-1"
                                            ></v-radio>
                                        </div>
                                    </div>
                                </v-radio-group>
                            </div>
                        </div>
                    </div>

                    <div class="mt-3">
                        <v-btn
                        density="compact"
                        :color="!language ? '#999' : 'var(--main-color)'"
                        width="200"
                        :disabled="!language"
                        @click="beginExam()"
                        >
                            <v-icon :color="!language ? '#444' : '#fff'">mdi-play-circle-outline</v-icon>
                            <span class="ml-1" :style="!language ? 'color: #444' : 'color: #fff'">{{ currentLang.prepareView[8] }}</span>
                        </v-btn>
                    </div>
                </div>

                <div class="timer" v-if="step=='timer'">
                    <div class="d-flex flex-column align-center">
                        <spinner-component/>
                        <div class="mt-7">
                            <span style="font-size: 1.2em;">{{ currentLang.prepareView[9] }}: <span style="font-weight: 700; color:var(--special-color)">{{ time }}</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { getSubject } from '@/utils/getInfo';
import SpinnerComponent from '@/components/SpinnerComponent'

export default {
    data(){
        return {
            step: undefined,
            language: undefined,
            time: 5,
            timerInterval: undefined
        }
    },
    components: {
        SpinnerComponent
    },
    computed: mapGetters(['getInitializationProcess', 'getUserData', 'getCurrentTickets', 'getCurrentExamID', 'getExams', 'getSubjects', 'getCurrentExam', 'getCurrentModuleExam', 'getCurrentExamsList', 'currentLang']),
    methods: {
        ...mapMutations(['setCurrentExam', 'setExamLanguage', 'setExamState', 'setCurrentExamsList', 'setCurrentModuleExam']),

        getTicketsCount(){
            const currentTicket = this.getCurrentTickets.find(ticket => ticket.subject == this.getCurrentModuleExam.subject)
            return currentTicket.ticketNumber
        },

        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },

        getLanguageName(lang){
            if(lang=='ru'){
                return 'Русский'
            } else if(lang=='eng'){
                return 'English'
            } else if(lang=='custom'){
                return 'Foregin'
            } else if(lang=='uz_l'){
                return "O'zbek"
            } else if(lang=='uz_k'){
                return 'Ўзбек'
            } else if(lang=='fr'){
                return 'French'
            } else if(lang=='de'){
                return 'German'
            }
        },

        beginExam(){
            this.step = 'timer'

            this.timerInterval = setInterval(()=>{
                if(this.time!=0){
                    this.time-= 1
                }
            },1000)

            setTimeout(()=>{
                clearInterval(this.timerInterval)
                this.setExamState(true)
                this.$router.push('/exam')
                console.log('Begin!');
            }, 5200)
        }
    },
    watch:{
        language(){
            this.setExamLanguage(this.language)
        }
    },
    mounted(){
        if(!this.getInitializationProcess){
            this.$router.push('/')
        }
        if(!this.getExams){
            this.$router.push('/')
        }
        if(!this.getUserData){
            this.$router.push('/auth')
        }
        if(!this.getCurrentTickets){
            this.$router.push('/coordinator')
        }

        if(!this.getCurrentExam){
            this.getExams.forEach(exam=>{
                console.log(exam);
                if(exam.id==this.getCurrentExamID){
                    this.setCurrentExam(exam)
                }
            })  
        }      

        if(!this.getCurrentExamsList){
            // Если комплекс то устанавливаем список
            if(this.getCurrentExam.complex.length>1 && this.getCurrentExam.complexOptions!==null){
                const priority = this.getCurrentExam.complexOptions.examsOrder.map(moduleEx=>{
                    return {
                        subject: moduleEx,
                        isPassed: false
                    }
                })

                this.setCurrentExamsList(priority)
            }
        }
        
        if(!this.getCurrentModuleExam){
            this.setCurrentModuleExam(this.getCurrentExam.complex[0])
        }

        if(this.getCurrentModuleExam.params.languages.length>1){
            this.step = 'choise-lang'
        } else {
            // начать экзамен
            this.setExamLanguage(this.getCurrentModuleExam.params.languages[0])
            this.beginExam()
        }
    },
    unmounted(){
        clearInterval(this.timerInterval)
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

.form{
    background-color: #fff;
    padding: 20px;
    width: 50%;
    border-radius: 5px;
}

.form__header{

}

.form__content{
    height: 400px;
}
.languages{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.timer{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center
}

.langs{
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-evenly;
    gap: 30px;
}
</style>

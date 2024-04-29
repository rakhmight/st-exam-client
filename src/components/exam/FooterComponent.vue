<template>
    <div class="footer" v-if="ticket && ticket.questions">
        <div class="footer-wrap">
            <div></div>

            <div style="width: 100%; display: flex; justify-content: space-between; gap:50">
                <div class="d-flex align-center" style="gap: 50px">
                    <div class="d-flex align-center">
                        <v-icon size="18" color="#dcdcdcd0">mdi-ticket-outline</v-icon>
                        <span class="ml-1"><span style="color: #dcdcdcd0">{{ currentLang.examView[3] }}:</span> {{ ticket.ticketNumber }}</span>
                    </div>
                    
                    <v-tooltip>
                        <template v-slot:activator="{ props }">
                            
                            <div v-bind="props" style="cursor: help; max-width: 500px;" class="lim-txt">
                                <v-icon size="19" color="#dcdcdcd0">mdi-alpha-t-box-outline</v-icon>
                                <span class="ml-1"><span style="color: #dcdcdcd0">{{ currentLang.examView[4] }}:</span> {{ getThemeName(theme) }}</span>
                            </div>
                        </template>
                        <span>{{ getThemeName(theme) }}</span>
                    </v-tooltip>
                    
                    <div class="d-flex align-center" v-if="difficulty">
                        <div class="d-flex align-center" style="gap: 2px">
                            <v-icon size="18" :color="difficulty >= 1 ? 'var(--red-color)' : '#dcdcdcd0'">mdi-square-rounded</v-icon>
                            <v-icon size="18" :color="difficulty >= 2 ? 'var(--red-color)' : '#dcdcdcd0'">mdi-square-rounded</v-icon>
                            <v-icon size="18" :color="difficulty >= 3 ? 'var(--red-color)' : '#dcdcdcd0'">mdi-square-rounded</v-icon>
                        </div>
                        <span class="ml-1"><span style="color: #dcdcdcd0">{{ currentLang.examView[5] }}:</span> {{ difficulty == 1 ? currentLang.examView[6] : difficulty == 2 ? currentLang.examView[7] : difficulty == 3 ? currentLang.examView[8] : 'unknown' }}</span>
                    </div>
                </div>

                <div class="d-flex align-center" style="gap:20px" v-if="getCurrentExam.complex[0].params.questionTime!==null">
                    <div class="d-flex align-center">
                        <v-icon size="18" color="#dcdcdcd0">mdi-clock-time-eight-outline</v-icon>
                        <span class="ml-1"><span style="color: #dcdcdcd0">{{ currentLang.examView[9] }}:</span> 0:40</span>
                    </div>
                    <div>
                        <div class="main-line">
                            <div class="second-line" style="width: 50px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getTheme } from '@/utils/getInfo'
import { mapGetters } from 'vuex'

export default {
    props:{
        ticket: Object,
        getCurrentExam: Object,
        currentQuestion: Number
    },
    data(){
        return {
            theme: undefined,
            difficulty: undefined
        }
    },
    computed: mapGetters(['getSubjects', 'currentLang']),
    methods:{
        setCurrentTheme(){
            const target = this.ticket.questions.find(question=>question.id==this.currentQuestion)
            if(target){
                this.theme = target.theme

                if(target.difficulty){
                    this.difficulty = target.difficulty
                }
            }
        },

        getThemeName(id){
            return getTheme(this.ticket.subject, id, this.getSubjects)
        }
    },
    watch:{
        currentQuestion(){
            this.setCurrentTheme()
        }
    },
    mounted(){
        this.setCurrentTheme()
    }
}
</script>


<style scoped>
.footer{
    bottom: 0;
    position: fixed;
    width: 100%;
    height: 40px;
    background-color: #2d2d2d;
    color: #fff
}
.footer-wrap{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 250px auto; 
}

.main-line{
    width: 250px;
    height: 3px;
    background-color: #a9a9a9;
    position: relative;
}
.second-line{
    height: 3px;
    background-color: var(--main-color);
    position: absolute;
}
</style>

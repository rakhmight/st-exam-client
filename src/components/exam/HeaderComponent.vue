<template>
     <div class="header">
        <div class="header-wrap">
            <div class="d-flex align-center pl-2">
                <div>
                    <v-img src="@/assets/media/logo.png" width="45" height="45"></v-img>
                </div>
                <span class="text-h5 ml-2">Smart Testing</span>
            </div>

            <div style="width: 100%;display: grid; grid-template-columns: 1.2fr 0.8fr; gap:50">
                <div class="d-flex align-center" style="gap: 50px">
                    <div class="d-flex align-center">
                        <v-icon size="18" color="#dcdcdcd0">mdi-help-circle-outline</v-icon>
                        <span class="ml-1"><span style="color: #dcdcdcd0">{{ currentLang.examView[10] }}:</span> {{ answeredQuestions.length }}/{{ ticket.questions.length }}</span>
                    </div>

                    <div class="d-flex align-center" style="gap: 20px">
                        <div class="d-flex align-center">
                            <v-icon size="18" color="#dcdcdcd0">mdi-clock-time-eight-outline</v-icon>
                            <span class="ml-1"><span style="color: #dcdcdcd0">{{ currentLang.examView[11] }}:</span> <span :style="timer!==null && timer<31 ? 'color: #ff5402' : ''">{{ timer===null ? `∞ (${currentLang.examView[12]})` : formatTime(timer) }}</span></span>
                        </div>
                        
                        <div class="main-line" v-if="timer!==null">
                            <div class="second-line" :style="timer!==null && timer<31 ? `background-color: #ff5402; width: ${timer*timePoint}%` : `width: ${timer*timePoint}%`"></div>
                        </div>
                    </div>
                </div>

                <div class="d-flex align-center">
                    <v-tooltip>
                        <template v-slot:activator="{ props }">
                            <div v-bind="props" class="lim-txt" style="width: 500px;cursor: help;">
                                <v-icon size="19" color="#dcdcdcd0">mdi-alpha-s-box-outline</v-icon>
                                <span class="ml-1"><span style="color: #dcdcdcd0">{{ currentLang.examView[13] }}:</span> {{ getSubjectName(ticket.subject) }}</span>
                            </div>
                        </template>
                        <span>{{ getSubjectName(ticket.subject) }}</span>
                    </v-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getSubject } from '@/utils/getInfo'
import { mapGetters } from 'vuex'

export default {
    props:{
        timer: Number,
        ticket: Object,
        answeredQuestions: Array,
        timePoint: Number
    },
    computed: mapGetters(['getSubjects', 'currentLang']),
    methods:{
        // Форматирует таймер
        formatTime(time) {
            const minutes = Math.floor(time / 60)
            let seconds = time % 60

            if (seconds < 10) {
                seconds = `0${seconds}`
            }

            return `${minutes}:${seconds}`
        },

        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        }
    },
}
</script>


<style scoped>
.header{
    top: 0;
    position: fixed;
    width: 100%;
    height: 70px;
    background-color: var(--main-color);
    color: #fff;
    z-index: 10
}
.header-wrap{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 250px auto;
}

.main-line{
    width: 400px;
    height: 3px;
    background-color: #7d7d7d;
    position: relative;
}
.second-line{
    height: 3px;
    background-color: #fff;
    position: absolute;
}
</style>

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
                            <span>{{ currentLang.prepareView[6] }}: <span style="color: var(--main-color)">{{ getCurrentModuleExam ? getTicketsCount() : getCurrentTickets[0].ticketNumber ? getCurrentTickets[0].ticketNumber : 'unknown' }}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            <v-divider class="mt-3 mb-3"></v-divider>

            <div class="form__content">
                <div class="languages" v-if="step=='choise-lang'">
                    <div style="flex: 1 1 auto;" class="d-flex justify-center flex-column" v-if="getCurrentModuleExam.params.languages.length>1">
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

                    <div class="mt-3" :style="getCurrentModuleExam.params.languages.length==1 ? 'flex: 1 1 auto;display: flex;align-items: center;' : ''">
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

                <div class="timer" v-if="step=='timer' || step=='stop'">
                    <div class="d-flex flex-column align-center">
                        <spinner-component/>
                        <div class="mt-7">
                            <span style="font-size: 1.2em;" v-if="step=='timer'">{{ currentLang.prepareView[9] }}: <span style="font-weight: 700; color:var(--special-color)">{{ time }}</span></span>
                            <span v-if="step=='stop'" style="font-size: 1.2em; color: red">{{ currentLang.prepareView[10] }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        
        <div style="position: absolute; bottom: 0; right: 0; z-index: 777; padding: 2px 20px">
            <v-btn
            icon
            v-bind="props"
            color="var(--red-color)"
            density="comfortable"
            @click="exitToCoordination()"
            >
                <v-icon
                size="18"
                color="white"
                >mdi-exit-to-app</v-icon>
            </v-btn>
        </div>

        <div style="position: absolute; top: 0; left: 0; z-index: 777; padding:10px 20px; width: 100%">
            <div class="d-flex align-center mt-2 w-full">
                <v-icon size="20" color="var(--main-color)">mdi-account</v-icon>
                <span class="ml-2" style="color: #555; width: 100%">

                    <span v-if="getUserData.userData.userRole == 'student'">
                        <span v-if="currentLang.language == 'ru'">{{ getUserData.userData.roleProperties.educationForm == 'full-time' ? currentLang.examView[62] : getUserData.userData.roleProperties.educationForm == 'in-absentia' ? currentLang.examView[63] : getUserData.userData.roleProperties.educationForm == 'magistracy' ? currentLang.examView[64] : 'unknown' }} {{ getCourse(+getUserData.userData.roleProperties.recieptDate) }}-{{ currentLang.examView[65] }}  {{ getCourse(+getUserData.userData.roleProperties.recieptDate) }}{{ getUserData.userData.roleProperties.group < 10 ? `0${getUserData.userData.roleProperties.group}` : getUserData.userData.roleProperties.group }}-{{ currentLang.examView[66] }} </span>
                        <span v-if="currentLang.language == 'uz_l'">{{ getCourse(+getUserData.userData.roleProperties.recieptDate) }}-{{ currentLang.examView[65] }}  {{ getCourse(+getUserData.userData.roleProperties.recieptDate) }}{{ getUserData.userData.roleProperties.group < 10 ? `0${getUserData.userData.roleProperties.group}` : getUserData.userData.roleProperties.group }}-{{ currentLang.examView[66] }} {{ getUserData.userData.roleProperties.educationForm == 'full-time' ? currentLang.examView[62] : getUserData.userData.roleProperties.educationForm == 'in-absentia' ? currentLang.examView[63] : getUserData.userData.roleProperties.educationForm == 'magistracy' ? currentLang.examView[64] : 'unknown' }} </span>
                    </span>
                    <span v-if="getUserData.userData.userRole == 'enrollee'">
                        <span v-if="currentLang.language == 'ru'">{{ currentLang.examView[68] }} {{ getUserData.userData.roleProperties.group }}-{{ currentLang.examView[66] }} ({{ getUserData.userData.roleProperties.admissionYear }}, {{ getUserData.userData.roleProperties.educationForm == 'full-time' ? currentLang.examView[34] : getUserData.userData.roleProperties.educationForm == 'in-absentia' ? currentLang.examView[35] : getUserData.userData.roleProperties.educationForm == 'magistracy' ? currentLang.examView[36] : 'unknown' }})</span>
                        <span v-if="currentLang.language == 'uz_l'">
                            {{ getUserData.userData.roleProperties.group }}-{{ currentLang.examView[66] }} {{ currentLang.examView[68] }} ({{ getUserData.userData.roleProperties.admissionYear }}, {{ getUserData.userData.roleProperties.educationForm == 'full-time' ? currentLang.examView[34] : getUserData.userData.roleProperties.educationForm == 'in-absentia' ? currentLang.examView[35] : getUserData.userData.roleProperties.educationForm == 'magistracy' ? currentLang.examView[36] : 'unknown' }})
                        </span>
                    </span>
                    <span v-if="getUserData.userData.userRole == 'teacher'">
                        <span v-if="currentLang.language == 'ru'">{{ currentLang.examView[69] }} {{ currentLang.examView[71] }} "{{ getDepartment(getUserData.userData.roleProperties.department) }}"</span>
                        <span v-if="currentLang.language == 'uz_l'">"{{ getDepartment(getUserData.userData.roleProperties.department) }}" {{ currentLang.examView[71] }} {{ currentLang.examView[69] }}</span>
                    </span>
                    <span v-if="getUserData.userData.userRole == 'employee'">
                        <span v-if="currentLang.language == 'ru'">{{ currentLang.examView[70] }} {{ currentLang.examView[72] }} "{{ getDepartment(getUserData.userData.roleProperties.department) }}"</span>
                        <span v-if="currentLang.language == 'uz_l'">"{{ getDepartment(getUserData.userData.roleProperties.department) }}" {{ currentLang.examView[72] }} {{ currentLang.examView[70] }}</span>
                    </span>

                    <span style="margin-left: 5px; font-weight: bold;">{{ `${getUserData.userData.bio.firstName ? getUserData.userData.bio.firstName : ''} ${getUserData.userData.bio.lastName ? getUserData.userData.bio.lastName : ''} ${getUserData.userData.bio.patronymic ? getUserData.userData.bio.patronymic : ''}` }}</span>
                    <span style="margin-left: 5px;">({{ getUserData.authData.login }})</span>
                </span>
            </div>  
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { getSubject } from '@/utils/getInfo';
import SpinnerComponent from '@/components/SpinnerComponent'
import { socket } from '@/socket';

export default {
    data(){
        return {
            step: undefined,
            language: undefined,
            time: 5,
            timerInterval: undefined,
            timerTimeout: undefined,
        }
    },
    components: {
        SpinnerComponent
    },
    computed: mapGetters(['getInitializationProcess', 'getUserData', 'getCurrentTickets', 'getCurrentExamID', 'getExams', 'getSubjects', 'getCurrentExam', 'getCurrentModuleExam', 'getCurrentExamsList', 'currentLang', 'getDepartments']),
    methods: {
        ...mapMutations(['setCurrentExam', 'setExamLanguage', 'setExamState', 'setCurrentExamsList', 'setCurrentModuleExam', 'setExamToken', 'updExamUserStatus', 'setCurrentTickets', 'setCurrentExamID', 'setAuthState']),

        exitToCoordination(){
            clearInterval(this.timerInterval)
            clearTimeout(this.timerTimeout)
            this.setCurrentTickets(undefined)
            this.setCurrentExamID(undefined)
            this.setCurrentExam(undefined)
            this.setCurrentModuleExam(undefined)
            this.setAuthState(false)
            this.$router.push('/coordinator')
        },

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

        getTicketsCount(){
            const currentTicket = this.getCurrentTickets.find(ticket => ticket.subject == this.getCurrentModuleExam.subject)
            if(currentTicket) return currentTicket.ticketNumber
            else return 'unknown'
            
        },

        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },

        handleEnterKey(){
            if(event.code=='Enter' || event.code == 'NumpadEnter'){
                if(this.language && this.step == 'choise-lang') this.beginExam()
            }
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

            this.timerTimeout = setTimeout(()=>{
                clearInterval(this.timerInterval)

                if(this.step != 'stop'){
                    this.setExamState(true)
                    this.$router.push('/exam')
                    console.log('Begin!');
                } else {
                    clearTimeout(this.timerTimeout)
                    this.setCurrentTickets(undefined)
                    this.setCurrentExamID(undefined)
                    this.setCurrentExam(undefined)
                    this.setCurrentModuleExam(undefined)
                    this.$router.push('/coordinator')
                }
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

        console.log(this.getCurrentModuleExam);
        console.log(this.getCurrentTickets);

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
            this.language = this.getCurrentModuleExam.params.languages[0]
            if(this.getCurrentExam.complex.length == 1) this.beginExam()
            else this.step = 'choise-lang'
        }

        document.addEventListener('keydown', this.handleEnterKey);
        
        socket.on(`client-reset-${this.getUserData.authData.id}`, (data)=>{
            this.setExamState(false)
            this.updExamUserStatus({ id: data.examID, status: 'waiting' })
            this.setExamToken(data.token)
            this.step = 'stop'
        })
        socket.on(`client-stop-${this.getUserData.authData.id}`, (data)=>{
            this.setExamState(false)
            this.updExamUserStatus({ id: data.examID, status: 'blocked' })
            this.step = 'stop'
        })
    },
    unmounted(){
        clearInterval(this.timerInterval)
        clearTimeout(this.timerTimeout)
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

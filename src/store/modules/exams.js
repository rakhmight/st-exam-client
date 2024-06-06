export default {
    state: {
        exams: [],
        currentTickets: undefined,
        currentExam: undefined,
        currentExamID: undefined,
        examLanguage: undefined,
        examState: false,
        examsStatusUpdating: false,
        examsListNeedToUpdating: false,
        // for complex
        currentExamsList: undefined,
        currentModuleExam: undefined
    },
    getters: {
        getExamsListNeedToUpdating(state){
            return state.examsListNeedToUpdating
        },
        getExamsStatusUpdating(state){
            return state.examsStatusUpdating
        },
        getExams(state){
            return state.exams
        },
        getCurrentTickets(state){
            return state.currentTickets
        },
        getCurrentExam(state){
            return state.currentExam
        },
        getCurrentExamID(state){
            return state.currentExamID
        },
        getExamLanguage(state){
            return state.examLanguage
        },
        getExamState(state){
            return state.examState
        },

        //
        getCurrentExamsList(state){
            return state.currentExamsList
        },
        getCurrentModuleExam(state){
            return state.currentModuleExam
        }
    },
    mutations: {
        updateExamsStatus(state, value){
            const target = state.exams.find(exam => exam.id == value.id)

            if(target){
                const index = state.exams.indexOf(target)

                if(value.status == 'begun'){
                    state.exams[index].hasBegun = true
                } else if(value.status == 'stopped'){
                    state.exams[index].hasBegun = false
                }
                
                state.examsStatusUpdating = !state.examsStatusUpdating
            }
            else {
                state.examsListNeedToUpdating = !state.examsListNeedToUpdating
            }
        },
        deleteExam(state, value){
            const target = state.exams.find(exam => exam.id == value)

            if(target){
                const index = state.exams.indexOf(target)
                state.exams.splice(index, 1)
            }
        },
        setExams(state, value){
            state.exams = value
        },
        setCurrentTickets(state, value){
            state.currentTickets = value
        },
        setCurrentExam(state, value){
            state.currentExam = value
        },
        setCurrentExamID(state, value){
            state.currentExamID = value
        },
        setExamLanguage(state, value){
            state.examLanguage = value
        },
        setExamState(state){
            return state.examState = state
        },

        
        setCurrentExamsList(state, value){
            state.currentExamsList = value
        },
        updateCurrentExamsList(state, value){
            const target = state.currentExamsList.find(ce => ce.subject == value)
            const index = state.currentExamsList.indexOf(target)

            state.currentExamsList[index].isPassed = true
            console.log(state.currentExamsList);
        },
        setCurrentModuleExam(state, value){
            state.currentModuleExam = value
        },

        updExamUserStatus(state, value){
            const target = state.exams.find( ex=> ex.id == value.id )
            if(target){
                const index = state.exams.indexOf(target)
                state.exams[index].userStatus = value.status
            }
        }
    },
    actions: {
    }
}
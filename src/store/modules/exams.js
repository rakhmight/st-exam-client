export default {
    state: {
        exams: [],
        currentTickets: undefined,
        currentExam: undefined,
        currentExamID: undefined,
        examLanguage: undefined,
        examState: false,
        // for complex
        currentExamsList: undefined,
        currentModuleExam: undefined
    },
    getters: {
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
        },
    },
    mutations: {
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
    },
    actions: {
    }
}
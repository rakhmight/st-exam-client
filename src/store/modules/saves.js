export default {
    state: {
        currentSaving: undefined,
        savesCounter: null,
    },
    getters: {
        getCurrentSaving(state){
            return state.currentSaving
        },
        getSavesCounter(state){
            return state.savesCounter
        }
    },
    mutations: {
        setCurrentSaving(state, value){
            state.currentSaving = value
        },
        setSavesCounter(state, value){
            state.savesCounter = value
        },
        updateSavesCounter(state,value){
            state.currentSaving = value

            state.savesCounter = value+1
            localStorage.removeItem('savesCounter')
            localStorage.setItem('savesCounter', value+1)
        }
    },
    actions: {
    }
}
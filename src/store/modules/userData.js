export default {
    state: {
        userData: undefined,
        isAuthorized: false,
        examToken: undefined
    },
    getters: {
        getUserData(state){
            return state.userData
        },
        getAuthState(state){
            return state.isAuthorized
        },
        getExamToken(state){
            return state.examToken
        }
    },
    mutations: {
        setUserData(state, value){
            state.userData = value
        },
        setAuthState(state, value) {
            state.isAuthorized = value
        },
        setExamToken(state, value){
            state.examToken = value
        }
    },
    actions: {
    }
}
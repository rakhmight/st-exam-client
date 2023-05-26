export default {
    state: {
        userData: undefined,
        isAuthorized: false
    },
    getters: {
        getUserData(state){
            return state.userData
        },
        getAuthState(state){
            return state.isAuthorized
        }
    },
    mutations: {
        setUserData(state, value){
            state.userData = value
        },
        setAuthState(state, value) {
            state.isAuthorized = value
        }
    },
    actions: {
    }
}
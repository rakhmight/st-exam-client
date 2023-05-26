export default {
    state: {
        adminServerIP: undefined,
        examServerIP: undefined,
        authServerIP: undefined,
        socketCode: undefined,
        deviceID: undefined,
        initializationProcess: false
    },
    getters: {
        getAdminServerIP(state){
            return state.adminServerIP
        },
        getExamServerIP(state){
            return state.examServerIP
        },
        getAuthServerIP(state){
            return state.authServerIP
        },
        getSocketCode(state){
            return state.socketCode
        },
        getDeviceID(state){
            return state.deviceID
        },
        getInitializationProcess(state){
            return state.initializationProcess
        }
    },
    mutations: {
        setAdminServerIP(state, value){
            state.adminServerIP = value
        },
        setExamServerIP(state, value){
            state.examServerIP = value
        },
        setAuthServerIP(state, value){
            state.authServerIP = value
        },
        setSocketCode(state, value){
            state.socketCode = value
        },
        setDeviceID(state, value){
            state.deviceID = value
        },
        setInitializationProcess(state, value){
            state.initializationProcess = value
        }
    },
    actions: {
    }
}  
import lang from '@/utils/lang'
export default {
    state: {
        adminServerIP: undefined,
        examServerIP: undefined,
        authServerIP: undefined,
        socketCode: undefined,
        deviceID: undefined,
        initializationProcess: false,
        language: lang.ru
    },
    getters: {
        currentLang(state){
            return state.language
        },
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
        changeLang(state, newLang){
            if(newLang=='ru'){
                state.language = lang.ru
            }else if(newLang=='uz_l'){
                state.language = lang.uz_l
            }else if(newLang=='uz_k'){
                state.language = lang.uz_k
            }else if(newLang=='eng'){
                state.language = lang.eng
            }
        },
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
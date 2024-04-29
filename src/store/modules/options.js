import lang from '@/utils/lang'
export default {
    state: {
        adminServerIP: undefined,
        examServerIP: undefined,
        authServerIP: undefined,
        helperServerIP: undefined,
        socketCode: undefined,
        deviceID: undefined,
        initializationProcess: false,
        language: lang.uz_l,
        exception: {
            info: null,
            status: false,
            error: null
        }
    },
    getters: {
        currentLang(state){
            return state.language
        },
        getAdminServerIP(state){
            return state.adminServerIP
        },
        getHelperServerIP(state){
            return state.helperServerIP
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
        },
        getException(state){
            return state.exception
        }
    },
    mutations: {
        setException(state, value){
            state.exception = value
        },
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
        setHelperServerIP(state, value){
            state.helperServerIP = value
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
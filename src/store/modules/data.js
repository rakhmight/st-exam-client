export default {
    state: {
        subjects: [],
        usersList: [],
        departments: [],
    },
    getters: {
        getSubjects(state){
            return state.subjects
        },
        getUsersList(state){
            return state.usersList
        },
        getDepartments(state){
            return state.departments
        }
    },
    mutations: {
        setSubjects(state, value){
            state.subjects = value
        },
        setUsersList(state, value){
            state.usersList = value
        },
        setDepartments(state, value){
            state.departments = value
        }
    },
    actions: {
    }
}
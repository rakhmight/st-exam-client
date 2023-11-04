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
        },
        deleteExaminees(state, value){
            value.map(examinee => {
                if(examinee){
                    const target = state.usersList.find(user => user.id == examinee)
                    const index = state.usersList.indexOf(target)
                    state.usersList.splice(index, 1)
                }
            })
        },
        deleteExaminee(state, value) {
            const target = state.usersList.find(user => user.id == value)
            const index = state.usersList.indexOf(target)
            state.usersList.splice(index, 1)
        }
    },
    actions: {
    }
}
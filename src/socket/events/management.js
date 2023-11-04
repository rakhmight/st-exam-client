import store from '@/store'

export function management(socket) {
    socket.on("client-delete-exam", (data) => {
        store._mutations.deleteExaminees[0](data.examineesList)
    });

    socket.on("client-exclude-user", (data) => {
        store._mutations.deleteExaminee[0](data.userID)
    })
}
export function checkEvent(socket, deviceID) {
    socket.on(`client-check-${deviceID}`, ()=>{
        console.info('[Socket] Checking socket connection');
        socket.emit(`admin-checkOk`, deviceID)
    })
}
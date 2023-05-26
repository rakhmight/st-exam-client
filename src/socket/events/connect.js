export function connectEvent(socket) {
    socket.on("connect", () => {
        console.info('[Socket] Connected successfully');
    });
}
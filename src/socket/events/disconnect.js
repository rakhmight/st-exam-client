export function disconnectEvent(socket) {
    socket.on("disconnect", () => {
        console.info('[Socket] Disconnected');
    });
}
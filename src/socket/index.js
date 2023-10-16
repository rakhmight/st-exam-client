import { io } from "socket.io-client";
// Events
import { connectEvent } from "./events/connect";
import { disconnectEvent } from "./events/disconnect";
import { checkEvent } from "./events/check";

const secretCode = localStorage.getItem('socket-code')
const deviceID = localStorage.getItem('device-id')

const adminServeIP = localStorage.getItem('st-admin-server')
// "undefined" means the URL will be computed from the `window.location` object
//const URL = process.env.NODE_ENV === "production" ? undefined : "http://127.0.0.1:4500";
const URL = adminServeIP

export const socket = io(URL, {
    autoConnect: false,
    query: {
      secretCode
    }
});

// Events
connectEvent(socket)
disconnectEvent(socket)
checkEvent(socket, deviceID)
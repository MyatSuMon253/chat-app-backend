import { Socket, Server as SocketIOServer } from "socket.io";

export function registerUserEvents(io: SocketIOServer, socket: Socket) {
    socket.on('testSocket', (data: any) => {
        socket.emit('testSocket', { message: `realtime update` })
    })
}
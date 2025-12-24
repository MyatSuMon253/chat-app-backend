import dotenv from 'dotenv';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { registerUserEvents } from './userEvents';
dotenv.config();

export function initializeSocket(server: any): SocketIOServer {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*", // allow all origins
        }
    })

    // auth middleware
    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: no token provided"));
        }

        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
            if (err) {
                return next(new Error("Authentication error: invalid token"));
            }

            let userData = decoded.user;
            socket.data = userData;
            socket.data.userId = userData.id;
            next();
        })
    });

    // when socket connects, register events
    io.on('connection', async (socket: Socket) => {
        const userId = socket.data.userId;
        console.log(`user ${userId} ${socket.data.name} connected`);

        // register events
        registerUserEvents(io, socket);

        socket.on('disconnect', () => {
            console.log(`user ${userId} ${socket.data.name} disconnected`);
        });
    })

    return io;
}
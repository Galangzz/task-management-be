const { Server } = require('socket.io');

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
        },
    });

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('join-user', (userId) => {
            socket.join(`user-${userId}`);
            console.log(`-USER- ${userId} joined`);
        });

        socket.on('disconnect', () => {
            console.log('a user disconnected');
        });
    });
    return io;
}

module.exports = { setupSocket };

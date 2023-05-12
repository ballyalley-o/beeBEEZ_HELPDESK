let io;

module.exports = {
    init: httpServer => {
        io = require('socket.io')(httpServer, {
            allowEIO3: true,
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io NOT INITIALIZED')
        }
        return io;
    }
}
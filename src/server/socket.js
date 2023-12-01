// src/server/socket.js
const globals = require('../globals')

const _register = require('./commands/register')

const allowed_headers = process.env.ALLOWED_HEADERS.split(',')

let io;
let log;
let server;

module.exports.start = async () => {
    io = globals.getIO();
    log = globals.getLog();

    log.success("Socket initializer started.")

    io.on('connection', (socket) => {
        const origin = socket.handshake.query.token;
        // if (!allowed_headers.includes(origin)) {
        //     socket.emit('error', { success: false, message: 'Invalid connection' });
        //     log.console(`Connection rejected due to invalid quiery token: ${socket.handshake.address}`)
        //     return socket.disconnect();
        // }

        if (process.env.NODE_ENV === 'development')
            log.console(`Socket connected: ${socket.id}, origin: ${origin}`)

        /**
        * @brief Custom registered actions
        * For better modularization of the code
        */
        _register.register(socket);
      
        /**
        * @brief Test socket connection
        */
        socket.on('verify', (msg) => {
            if (process.env.NODE_ENV === 'development')
                log.console(`Client requested verification: ${msg?.emitName}`)

            io.emit('verify', msg);
        });
      
        /**
        * @brief Client disconnected from server
        */
        socket.on('disconnect', () => {
            if (process.env.NODE_ENV === 'development')
                log.console(`Socket disconnected: ${socket.id}`)

        });
      });
      
}

// Start the server
module.exports.init = async () => {
    server = globals.getServer();
    const port = process.env.PORT || 80;
    
    server.listen(port, () => {
        log.success(`Server is running on port ${port}`)
    });
};
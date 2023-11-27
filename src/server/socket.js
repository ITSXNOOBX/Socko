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
        log.console(`Socket connected: ${socket}`)
        
        const origin = socket.handshake.headers.origin;
        if (!allowed_headers.includes(origin)) {
            socket.emit('invalidConnection', { success: false, message: 'Invalid connection' });
            return socket.disconnect();
        }

        if (process.env.NODE_ENV === 'development')
            log.console(`Socket connected: ${socket.id}`)

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
                log.console(`Client requested verification: ${msg}`)

            io.emit('chat message', msg);
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
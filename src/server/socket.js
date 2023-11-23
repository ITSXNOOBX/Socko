// src/server/socket.js
const globals = require('../globals')

const _register = require('./commands/register')

const io = globals.getIO();
const server = globals.getServer();
const allowed_headers = process.env.ALLOWED_HEADERS.split(',')

module.exports.init = async () => {
    io.on('connection', (socket) => {
        const origin = socket.handshake.headers.origin;
        if (!allowed_headers.includes(origin)) {
            socket.emit('invalidConnection', { success: false, message: 'Invalid connection' });
            return socket.disconnect();
        }

        if (process.env.NODE_ENV === 'development')
            console.log(`Socket connected: ${socket.id}`);

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
                console.log('Client requested verification', msg)

            io.emit('chat message', msg);
        });
      
        /**
        * @brief Client disconnected from server
        */
        socket.on('disconnect', () => {
            if (process.env.NODE_ENV === 'development')
                console.log(`Socket disconnected: ${socket.id}`);
        });
      });
      
}

// Start the server
module.exports.start = async () => {
    const port = process.env.PORT || 80;
  
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
};
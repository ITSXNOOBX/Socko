// src/server/actions/register.js

const register = (socket) => {
    socket.on('register', (userData) => {
        console.log(userData)
    });
};

module.exports.register = register;
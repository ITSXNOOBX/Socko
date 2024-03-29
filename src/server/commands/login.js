// src/server/actions/login.js
const crypto = require('crypto');

const g = require('../../globals')
const rand_words = require('../../utils/random_words')
const mongo = require('../../db/mongo')

const login = (socket) => {
    const log = g.getLog();

    socket.on('login', async (ud) => {
        let parsed;
        try {
            parsed = JSON.parse(ud)
        } catch (e) { }

        if (!parsed.email || !parsed.password)
            return socket.emit("login", { success: false, message: "Invalid request parameters." });

        if (!isHash(parsed.email) || !isHash(parsed.password))
            return socket.emit("login", { success: false, message: "Data must be hashed." });

        try {
            const existingUser = await mongo.TeacherData.findOne({ email: parsed.email, user: parsed.password });

            if (existingUser) 
                return socket.emit("login", { success: true, message: "User logged successfully.", loggedIn: true });
            
            return socket.emit("login", { success: false, message: "Invalid credentials", loggedIn: false });
        } catch (e) {
            log.error(e)
            socket.emit("login", { success: false, message: "Failed to log in." });
        }
    });
};

const isHash = (str) => {
    return typeof str === 'string' && str.length === 64;
};

module.exports.login = login;
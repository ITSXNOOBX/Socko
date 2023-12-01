// src/server/actions/register.js
const crypto = require('crypto');

const g = require('../../globals')
const rand_words = require('../../utils/random_words')
const mongo = require('../../db/mongo')

const register = (socket) => {
    const log = g.getLog();

    socket.on('register', async (ud) => {
        if (!ud.email || !ud.password)
            return socket.emit("register", { success: false, message: "Invalid request parameters." });

        if (!isHash(ud.email) || !isHash(ud.password))
            return socket.emit("register", { success: false, message: "Data must be hashed." });

        const new_user = {
            email: ud.email,
            password: ud.password,
            code: rand_words.get_rand_code(),
        }

        try {
            const existingUser = await mongo.TeacherData.findOne({ email: ud.email });

            if (existingUser) 
                return socket.emit("register", { success: false, message: "Email already exists." });
            
            mongo.TeacherData.create(new_user);
        } catch (e) {
            log.error(e)
            socket.emit("register", { success: false, message: "Failed to register." });
        }

        socket.emit("register", { success: true, message: "Register Success." });
    });
};

const isHash = (str) => {
    return typeof str === 'string' && str.length === 64;
};

const randCode = () => {
    return crypto.randomBytes(8).toString('hex');
};

module.exports.register = register;
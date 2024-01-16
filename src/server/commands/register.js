// src/server/actions/register.js
const crypto = require('crypto');

const g = require('../../globals')
const rand_words = require('../../utils/random_words')
const mongo = require('../../db/mongo')

const register = (socket) => {
    const log = g.getLog();

    socket.on('register', async (ud) => {
        let parsed;
        try {
            parsed = JSON.parse(ud)
        } catch (e) { }

        if (!parsed.email || !parsed.password)
            return socket.emit("register", { success: false, message: "Invalid request parameters." });

        if (!isHash(parsed.email) || !isHash(parsed.password))
            return socket.emit("register", { success: false, message: "Data must be hashed." });

        const new_user = {
            email: parsed.email,
            password: parsed.password,
            code: rand_words.get_rand_code(),
        }

        try {
            const existingUser = await mongo.TeacherData.findOne({ email: parsed.email, password: parsed.password });

            if (existingUser) 
                return socket.emit("register", { success: true, message: "User has been successfully logged in.", loggedIn: true, teacherCode: existingUser.code });

            const existingEmail = await mongo.TeacherData.findOne({ email: parsed.email });

            if (existingEmail) 
                return socket.emit("register", { success: true, message: "Invalid password, the password linked to this email its different.", loggedIn: false  });
            
            mongo.TeacherData.create(new_user);
        } catch (e) {
            log.error(e)
            socket.emit("register", { success: false, message: "Failed to register." });
        }

        socket.emit("register", { success: true, message: "Register Success. Cloud features have been enabled!", teacherCode: new_user.code });
    });
};

const isHash = (str) => {
    return typeof str === 'string' && str.length === 64;
};

const randCode = () => {
    return crypto.randomBytes(8).toString('hex');
};

module.exports.register = register;
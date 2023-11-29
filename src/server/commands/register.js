// src/server/actions/register.js
const crypto = require('crypto');

const g = require('../../globals')
const mongo = require('../../db/mongo')

const register = (socket) => {
    const log = g.getLog();

    socket.on('register', (ud) => {
        if (!ud.email || !ud.password)
            return;

        if (!isHash(ud.email) || !isHash(ud.password))
            return;

        const new_user = {
            email: user_data.email,
            password: user_data.password,
            code: 'ABC123',
        }

        try {
            // mongo.TeacherData.create(new_user);
        } catch (e) {
            log.error(e)
        }
    });
};

const isHash = (str) => {
    return typeof str === 'string' && str.length === 64;
};

const randCode = () => {
    return crypto.randomBytes(8).toString('hex');
};

module.exports.register = register;
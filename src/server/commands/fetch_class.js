// src/server/actions/fetch_class.js

const g = require('../../globals');
const mongo = require('../../db/mongo');

const fetch_class = (socket) => {
    const log = g.getLog();

    socket.on('fetch_class', async (ud) => {
        let parsed;
        try {
            parsed = JSON.parse(ud)
        } catch (e) { }

        if (!parsed.token)
            return socket.emit("fetch_class", { success: false, message: "Invalid request parameters." });

        try {
            const teacherExists = await mongo.TeacherData.findOne({ password: parsed.token });

            if (!teacherExists)
                return socket.emit("fetch_class", { success: false, message: "Invalid auth token." });

            const all_students = await mongo.StudentGroup.fetch();

            return socket.emit("fetch_class", { success: true, message: "Student retreived updated successfully.", all_students });
        } catch (e) {
            log.error(e);
            socket.emit("fetch_class", { success: false, message: "Failed to update class." });
        }
    });
};

module.exports.fetch_class = fetch_class;

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
            const teacherExists = await mongo.TeacherData.findOne({ email: parsed.token });

            if (!teacherExists)
                return socket.emit("fetch_class", { success: false, message: "Invalid auth token." });

            console.log('teacherExists', teacherExists)

            const all_students = await mongo.StudentGroup.find({ teacher_code: teacherExists.code });

            console.log('fetch_class: all_students', all_students)

            return socket.emit("fetch_class", { success: true, message: "Student retreived updated successfully.", all_students });
        } catch (e) {
            log.error(e);
            socket.emit("fetch_class", { success: false, message: "Failed to update class." });
        }
    });
};

module.exports.fetch_class = fetch_class;

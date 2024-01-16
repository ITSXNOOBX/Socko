// src/server/actions/join_class.js

const g = require('../../globals');
const rand_words = require('../../utils/random_words');
const mongo = require('../../db/mongo');

const join_class = (socket) => {
    const log = g.getLog();

    socket.on('join_class', async (ud) => {
        let parsed;
        try {
            parsed = JSON.parse(ud)
        } catch (e) { }

        if (!parsed.group || !parsed.class)
            return socket.emit("join_class", { success: false, message: "Invalid request parameters." });

        try {
            const teacherExists = await mongo.TeacherData.findOne({ code: parsed.class });

            if (!teacherExists)
                return socket.emit("join_class", { success: false, message: "Teacher does not exist." });

            const existingGroup = await mongo.StudentGroup.findOne({ name: parsed.group });

            if (existingGroup)
                return socket.emit("join_class", { success: false, message: "Student group already exists.", alreadyClass: true });

            const newGroup = await mongo.StudentGroup.create({
                name: parsed.group,
                teacher_code: parsed.class,
                location: { x: 0, y: 0 },
                progress: 0, 
            });

            // log.success("")
            return socket.emit("join_class", { success: true, message: "Student group added successfully.", alreadyClass: false, group: newGroup ? true : false });
        } catch (e) {
            log.error(e);
            socket.emit("join_class", { success: false, message: "Failed to join class." });
        }
    });
};

module.exports.join_class = join_class;

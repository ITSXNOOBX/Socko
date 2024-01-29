// src/server/actions/update_class.js

const g = require('../../globals');
const mongo = require('../../db/mongo');

const update_class = (socket) => {
    const log = g.getLog();

    socket.on('update_class', async (ud) => {
        let parsed;
        try {
            parsed = JSON.parse(ud)
        } catch (e) { }

        if (!parsed.group || !parsed.class || !parsed.location_x || !parsed.location_y || !parsed.progress)
            return socket.emit("update_class", { success: false, message: "Invalid request parameters." });

        try {
            const teacherExists = await mongo.TeacherData.findOne({ code: parsed.class });

            if (!teacherExists)
                return socket.emit("update_class", { success: false, message: "Teacher does not exist." });

            const existingGroup = await mongo.StudentGroup.findOne({ name: parsed.group });

            if (!existingGroup)
                return socket.emit("update_class", { success: false, message: "Student group does not exist." });

            existingGroup.location =  { x: parsed.location_x, y: parsed.location_y };
            existingGroup.progress = parsed.progress;

            await existingGroup.save();
            const all_students = await mongo.StudentGroup.find({ teacher_code: parsed.class });

            console.log('all_students updated, this is the list now: ', all_students)
            console.log('Emmiting the  result to all fetch_class')
            
            socket.emit("fetch_class", { success: true, message: "Student retreived updated successfully.", all_students });
            return socket.emit("update_class", { success: true, message: "Student group updated successfully.", });
        } catch (e) {
            log.error(e);
            socket.emit("update_class", { success: false, message: "Failed to update class." });
        }
    });
};

module.exports.update_class = update_class;

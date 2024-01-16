// src/db/mongo.js
const mongoose = require('mongoose');
const globals = require('../globals');

const db_url = `mongodb://${process.env.DOCKER_HOST}:${process.env.DOCKER_PORT}`;
const db_name = process.env.DOCKER_DB;

let log;

/**
 * @brief Define and export mongoose schemas
 */
const Vector2Schema = new mongoose.Schema({
    x: Number,
    y: Number,
});

module.exports.TeacherDataSchema = new mongoose.Schema({
  email: String,
  password: String,
  code: String,
});

module.exports.StudentGroupSchema = new mongoose.Schema({
  name: String,
  teacher_code: String,
  location: Vector2Schema,
  team_leader: String,
  progress: Number,
});

/**
 * @brief Define and export mongoose models
 */
module.exports.TeacherData = mongoose.model('teacher_data', this.TeacherDataSchema);
module.exports.StudentGroup = mongoose.model('student_group', this.StudentGroupSchema);

/**
 * @brief Export init function
 */
module.exports.init = () => {
  log = globals.getLog();
  return new Promise(async (resolve, reject) => {
    try {
      mongoose.connect(`${db_url}/${db_name}`, { });
      const db = mongoose.connection;

      db.on('error', (err) => {
        log.error(`MongoDB connection error: ${err}`)
        reject(err);
      });

      db.once('open', async () => {
        log.success(`Connected to MongoDB`)

        const collections = await mongoose.connection.db.listCollections().toArray();
        // const databaseExists = collections.map(collection => collection.name).includes(db_name);
        // console.log("collections", collections)

        
        if (collections.length == 0) {
          // Create the collections if the database doesn't exist
          await db.createCollection('teacher_data');
          await db.createCollection('student_group');
          log.success(`Collections created successfully`)
        } else {
          log.success(`Database is already created, connecting to it.`)
        }

        globals.setDB(db);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
};

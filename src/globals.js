// src/globals.js

const globals = {};

exports.setIO = (io) => {
  globals.io = io;
};

exports.getIO = () => {
  if (!globals.io) {
    throw new Error('IO not initialized. Call setIO() first.');
  }

  return globals.io;
};

exports.setServer = (server) => {
  globals.server = server;
};

exports.getServer = () => {
  if (!globals.server) {
    throw new Error('Server not initialized. Call setServer() first.');
  }

  return globals.server;
};

exports.setDB = (db) => {
  globals.db = db;
};

exports.getDB = () => {
  if (!globals.db) {
    throw new Error('DB not initialized. Call setDB() first.');
  }

  return globals.db;
};

// src/init.js

require("dotenv").config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const globals = require('./globals');
const mongo = require('./db/mongo');
const sserver = require('./server/socket')

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

/**
 * @summary Export globally all these functions
 */
globals.setIO(io);
globals.setServer(server);

module.exports.start = async () => {
    mongo.init();
    sserver.init();
    sserver.start();
}
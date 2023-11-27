// src/init.js

require("dotenv").config();
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { Webhook } = require('dis-logs');
const mongoose = require('mongoose');

const globals = require('./globals');
const mongo = require('./db/mongo');
const sserver = require('./server/socket')

const log = new Webhook();

/**
 * @summary Export globally all these functions
 */
globals.setIO(io);
globals.setLog(log);
globals.setServer(server);

module.exports.start = async () => {
    log.success(`API Started in ${process.env.NODE_ENV === 'development' ? 'development' : 'production'}, node_env is "${process.env.NODE_ENV}"`);

    mongo.init();
    sserver.init();
    sserver.start();

    log.success("All modules initialized successfully!");
}
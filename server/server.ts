import express from 'express';
import logger from './logger';
import API from './api';
import * as http from 'http'
import { MongoClient, Db } from 'mongodb';

const url = process.env.DB_URL || 'mongodb://stime:stime@localhost:27017/stime';
const port = 3000;


export default class Server {
    server: http.Server;
    constructor(db: Db) {
        const app = express();
        app.use('/api', new API(db).router);
        this.server = http.createServer(app);
        this.server.listen(3000, () => logger.info(`Library server is running on ${port}`));
    }
}

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(mongoClient => {
        logger.info("Connected to " + url);
        const db = mongoClient.db("stime");
        new Server(db);
    })
    .catch(error => {
        logger.error(`Could not connect to ${url}. Error: ${error}`);
    })

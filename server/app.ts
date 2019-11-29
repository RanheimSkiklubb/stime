import express from 'express';
import API from './api';
import * as http from 'http'
import { Db } from 'mongodb';

export class App {
    expressServer: http.Server;
    constructor(db: Db) {
        const app = express();
        app.use('/api', new API(db).router);
        this.expressServer = http.createServer(app);
    }
}

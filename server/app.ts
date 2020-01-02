import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import API from './api/api';
import * as http from 'http'
import { Db } from 'mongodb';

export class App {
    expressServer: http.Server;
    constructor(db: Db) {
        const app = express();
        app.use(bodyParser.json());
        app.use(express.static('../client/build'));
        app.use(cors());
        app.use('/api', new API(db).router);
        this.expressServer = http.createServer(app);
    }
}

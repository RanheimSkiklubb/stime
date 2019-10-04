import express = require('express');
import { Response, Request } from "express";
import MongoAPI from './mongoAPI';
const app: express.Application = express();

MongoAPI.getInstance().then(init);

function init() {
    app.get('/event/:eventId', eventHandler);
    app.get('/', getHandler);
    app.listen(3000, appListener);
}

function getHandler(req: Request, res: Response) {
    res.send("Hello World")
}

function eventHandler(req: Request, res: Response) {
    const id = req.params.eventId;
    res.send(`Hello id: ${id}`);
}

function appListener() {
    console.log("App listening on port 3000");
}
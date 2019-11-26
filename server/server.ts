import express = require('express');
import { Response, Request, NextFunction } from "express";
import MongoAPI from './mongoAPI';
import logger from './logger';
import ExpressError from './express-error';
const app: express.Application = express();
let mongo:MongoAPI;

MongoAPI.getInstance().then(apiInstance => {
    mongo = apiInstance;
    init();
});

function init() {
    app.get('/event/:eventId', eventHandler);
    app.get('/', getHandler);
    app.use(errorHandler);
    app.listen(3000, appListener);
}

function getHandler(req: Request, res: Response) {
    res.send("Hello World")
}

function eventHandler(req: Request, res: Response) {
    const id = req.params.eventId;
    mongo.getEvent(id)
    .then(event => {
        if (event) {
            res.send(event);
        }
        else {
            res.status(404).send("Not found");
        }
    })
}

function appListener() {
    logger.info("App listening on port 3000");
}

function errorHandler (error: ExpressError, req: Request, res: Response, next:NextFunction) {
    logger.error(error.stack);
    if (res.headersSent) {
        return next(error)
    }
    res.status(500).send(error.stack);
}
import { Router } from 'express';
import logger from './logger';
import { Response, Request, NextFunction } from "express";
import MongoAPI from './mongoAPI';
import ExpressError from './express-error';

const router = Router();

router.all('*', requestLogger);
router.get('/event/:eventId', getEvent);
router.get('/ping', (req: Request, res: Response) => res.send("pong"));
router.use(errorHandler);    

function getEvent(req: Request, res: Response) {
    const id = req.params.eventId;
    MongoAPI.getInstance()
    .then(mongo=> mongo.getEvent(id))
    .then(event => {
        if (event) {
            res.send(event);
        }
        else {
            res.status(404).send("Not found");
        }
    })
}

function errorHandler (error: ExpressError, req: Request, res: Response, next:NextFunction) {
    logger.error(error.stack);
    if (res.headersSent) {
        return next(error)
    }
    res.status(500).send(error.stack);
}

function requestLogger(req: Request, res: Response, next: NextFunction) {
    let payloadLog = '';
    if (req.body && Object.keys(req.body).length > 0) {
        payloadLog = 'Payload: ' + JSON.stringify(req.body);
    }
    logger.debug(`${req.method} ${req.url} ${payloadLog}`);
    next();
}

const api = router;
export default api;
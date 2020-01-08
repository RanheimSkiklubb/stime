import { Router } from 'express';
import logger from '../logger';
import { Response, Request, NextFunction } from "express";
import MongoAPI from '../mongoAPI';
import ExpressError from '../express-error';
import { Db } from 'mongodb';
import Ajv from "ajv";
import { participantSchema } from './participant.schema'



export default class API {
    mongo: MongoAPI;
    router: Router;
    constructor(db: Db) {
        this.bind();
        this.mongo = new MongoAPI(db);
        this.router = this.setUpRoutes();
    }

    setUpRoutes(): Router {
        const router = Router();
        router.all('*', API.requestLogger);
        router.get('/event', this.getAllEvents);
        router.get('/event/:eventId', this.getEvent);
        router.post('/event/:eventId/participant', this.postParticipant)
        router.get('/club', this.getClub);
        router.get('/ping', (req: Request, res: Response) => res.send("pong"));
        router.use(API.errorHandler);
        return router;
    }

    getAllEvents(req: Request, res: Response) {
        this.mongo.getAllEvents()
            .then(events => res.send(events));
    }

    getEvent(req: Request, res: Response) {
        const id = req.params.eventId;
        this.mongo.getEvent(id)
        .then(event => {
            if (event) {
                res.send(event);
            }
            else {
                res.status(404).send("Not found");
            }
        })
    }

    postParticipant(req: Request, res: Response) {
        const ajv = new Ajv({allErrors: true});
        const isValid = ajv.validate(participantSchema, req.body);
        if (!isValid) {
            logger.warn("Invalid content" + JSON.stringify(ajv.errors));
            res.status(400).send("Invalid format: " + ajv.errors);
            return;
        }
        this.mongo.saveParticipant(req.params.eventId, req.body)
            .then((result) => {
                logger.debug("Write result: " + result);
                res.send("Ok")
            });
    }

    getClub(req: Request, res: Response) {
        this.mongo.getConfig()
            .then(event => {
                res.send(event.clubs) 
            })
            .catch(error => {
                res.status(500).send(error)
            })
    }

    bind() {
        this.getEvent = this.getEvent.bind(this);
        this.postParticipant = this.postParticipant.bind(this);
        this.getAllEvents = this.getAllEvents.bind(this);
        this.getClub = this.getClub.bind(this);
    }
    
    static errorHandler (error: ExpressError, req: Request, res: Response, next:NextFunction) {
        logger.error(error.stack);
        if (res.headersSent) {
            return next(error)
        }
        res.status(500).send(error.stack);
    }
    
    static requestLogger(req: Request, res: Response, next: NextFunction) {
        let payloadLog = '';
        if (req.body && Object.keys(req.body).length > 0) {
            payloadLog = 'Payload: ' + JSON.stringify(req.body);
        }
        logger.debug(`${req.method} ${req.url} ${payloadLog}`);
        next();
    }
    
}



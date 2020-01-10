import { App } from '../app';
import { request, expect, use } from 'chai';
import chaiHttp = require('chai-http');
import { describe, it, before, after } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, Db, Server } from 'mongodb';
import logger from '../logger';

let mongod: MongoMemoryServer;
let db: Db;

const startTime = new Date("2020-01-10T16:00:00.000Z");
const registrationStart = new Date("2020-01-01T16:00:00.000Z");
const registrationEnd = new Date("2020-01-09T16:00:00.000Z");

const event = { id : "1", name : "Event 1", startTime, registrationStart, registrationEnd, eventClasses: [], participants : [] }
const config = {
    _id: 1,
    clubs: [
        {
            name: "Skiclub United",
            shortName: "Skiclub"
        }
    ]
}

use(chaiHttp);

describe('Event API Request', () => {
    before((done) => {
        const dbName = "stime";
        mongod = new MongoMemoryServer({ instance: { dbName } });
        logger.info("Connecting to MongoMemoryServer...");
        mongod.getConnectionString()
            .then(connectionString => {
                logger.info("conn string: " + connectionString);
                return MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
            })
            .then(async mongoClient => {
                db = mongoClient.db(dbName);
                const eventCollection = await db.createCollection("event")
                eventCollection.insertOne(event);
                const configCollection = await db.createCollection("config")
                configCollection.insertOne(config);
                done();
            })
    });

    after((done) => {
        mongod.stop()
            .then(() => done());
    });

    it('should get 404 from /event/:id when events does not exit', (done) => {        
        const app = new App(db).expressServer;
        request(app)
            .get('/api/event/2')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            })
    })

    it('should get 200 and event when event exits', (done) => {
        const express = new App(db).expressServer;
        request(express).get('/api/event/1')
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('name', 'Event 1');
                expect(res.body).to.have.property('startTime', startTime.toISOString());
                expect(res.body).to.have.property('registrationStart', registrationStart.toISOString());
                expect(res.body).to.have.property('registrationEnd', registrationEnd.toISOString());
                done();
            }) 

    })

    it('should get 200 from /api/event/:id/participant when PROPER participant posted', (done) => {
        const express = new App(db).expressServer;
        const firstName = 'First Name';
        const lastName = 'Lastnameson';
        const club = 'Skiclub';
        const eventClass = 'Mini';
        request(express)
            .post('/api/event/1/participant')
            .send({ firstName, lastName, club, eventClass})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.equal(200);
                db.collection("event").findOne({id: "1"})
                    .then(event => {
                        expect(event.participants).to.have.lengthOf(1);
                        expect(event.participants[0]).to.have.property('firstName', firstName);
                        expect(event.participants[0]).to.have.property('lastName', lastName);
                        expect(event.participants[0]).to.have.property('club', club);
                        done();
                    })
            })
    });

    it('should get 400 from /api/event/:id/participant when IMPROPER participant posted', (done) => {
        const express = new App(db).expressServer;
        const firstName = 'First Name';
        const lastName = 'Lastnameson';
        const club = 'Skiclub';
        const eventClass = 'Mini';
        request(express)
            .post('/api/event/1/participant')
            .send({ firstName, lastName, club})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.equal(400);
                done();
            })
    })

    it('shoulg get 200 and all events from /events', (done) => {
        const express = new App(db).expressServer;
        request(express)
            .get('/api/event')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf(1);
                expect(res.body[0]).to.have.property('id', '1');
                done();
            })
    });

    it('should get 200 and all clubs from /clubs', (done) => {
        const express = new App(db).expressServer;
        request(express)
            .get('/api/club')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf(1);
                expect(res.body[0]).to.have.property('name', "Skiclub United");
                done();
            })
    });
})



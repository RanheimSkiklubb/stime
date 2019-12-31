import { App } from '../app';
import { request, expect, use } from 'chai';
import chaiHttp = require('chai-http');
import { describe, it, before, after } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, Db, Server } from 'mongodb';
import logger from '../logger';

let mongod: MongoMemoryServer;
let db: Db;

const event = {
    id : "1",
    name : "Telenorkarusell 2020 - Renn 1",
    startTime : new Date("2020-01-01T16:00:00.000Z"),
    participants : []
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
            .then(mongoClient => {
                db = mongoClient.db(dbName);
                db.createCollection("event")
                    .then(collection => collection.insertOne(event))
                done();
            })
    });

    after((done) => {
        mongod.stop()
            .then(() => done());
    });

    it('should return 404 when no events exits', (done) => {        
        const app = new App(db).expressServer;
        request(app)
            .get('/api/event/2')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            })
    })

    it('should return 200 when event exits', (done) => {
        const express = new App(db).expressServer;
        request(express).get('/api/event/1')
            .then(res => {
                expect(res.status).to.equal(200);
                done();
            }) 

    })

    it('should return 200 when proper participant posted', (done) => {
        const express = new App(db).expressServer;
        const firstName = 'Øyvind'
        const lastName = 'Øyvind'
        const club = 'Ranheim SK'
        request(express)
            .post('/api/event/1/participant')
            .send({ firstName, lastName, club, birthYear: 2013 })
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
    })


})



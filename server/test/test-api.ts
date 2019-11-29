import { App } from '../app';
import { request, expect, use } from 'chai';
import chaiHttp = require('chai-http');
import { describe, it } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, Db } from 'mongodb';
import logger from '../logger';

use(chaiHttp);

describe('Hello API Request', () => {
    it('should return 404 when no events exits', () => {
        setUpDb().then(db => {
            const express = new App(db).expressServer;
            return request(express).get('/api/event/1')
                .then(res => {
                    expect(res.status).to.equal(404);
                })
        })
    })

    it('should return 200 when event exits', () => {
        setUpDb().then(db => {
            addEventToDb(db)
            .then(() => {
                const express = new App(db).expressServer;
                return request(express).get('/api/event/1')
                    .then(res => {
                        expect(res.status).to.equal(200);
                    })
            })
            
        })
    })
})

async function setUpDb(): Promise<Db> {
    const dbName = "stime";
    const mongod = new MongoMemoryServer({ instance: { dbName } });
    logger.info("Connecting to MongoMemoryServer...");
    const connectionString = await mongod.getConnectionString();
    logger.info("conn string: " + connectionString);
    const mongoClient = await MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    return mongoClient.db(dbName);
}

async function addEventToDb(db: Db) {
    db.createCollection("event")
        .then(collection => collection.insertOne({
            "id" : "1",
            "name" : "Telenorkarusell 2020 - Renn 1",
            "startTime" : new Date("2020-01-01T16:00:00.000Z"),
            "participants" : []
        }))
}
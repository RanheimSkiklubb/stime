import { MongoClient, ObjectID, Db } from 'mongodb';
//const assert = require('assert');
//const logger = require('./logger');
//const ObjectId = require('mongodb').ObjectId;
//const moment = require('moment-timezone');
//const _ = require('lodash');

const url = process.env.DB_URL || 'mongodb://stime:stime@localhost:27017/stime';

export default class MongoAPI {
    private static instance: MongoAPI;
    db: Db;

    private constructor(db: Db) {
        this.db = db;
    }

    static connect(): Promise<Db> {
        return MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(mongoClient => mongoClient.db("stime"))
    }

    static getInstance(): Promise<void | MongoAPI> {
        if (!MongoAPI.instance) {
            return MongoAPI.connect()
                .then(db => {
                    MongoAPI.instance = new MongoAPI(db);
                })
                .catch(error => {
                    console.log("Exiting...")
                    process.exit();
                })
        }
        return Promise.resolve(MongoAPI.instance);
      }

}


import express = require('express');
import MongoAPI from './mongoAPI';
import logger from './logger';
import router from './api';
import * as http from 'http'

const app: express.Application = express();
const port = 3000;


app.use('/api', router)
const server = http.createServer(app);
server.listen(3000, () => logger.info(`Library server is running on ${port}`));

export default server;


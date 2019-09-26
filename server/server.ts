import express = require('express');
import { Response, Request } from "express";
const app: express.Application = express();

app.get('/', getHandler);
app.listen(3000, appListener);

function getHandler(req: Request, res: Response) {
    res.send("Hello World")
}

function appListener() {
    console.log("App listening on port 3000");
}
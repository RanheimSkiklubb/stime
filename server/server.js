import express from 'express';

const port = process.env.PORT|3001;
const app = express();
app.use(express.static('../client/build'));
app.get('/config', getConfigHandler);
app.listen(port, () => console.log(`Library server is running on ${port}`));
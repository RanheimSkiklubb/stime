import express from 'express';

const port = process.env.PORT|3001;
const app = express();
app.use(express.static('build'));
app.listen(port, () => console.log(`Library server is running on ${port}`));
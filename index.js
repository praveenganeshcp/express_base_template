const express = require('express');
require('dotenv').config();
const app = express();
const routes = require('./routes');
const connectToDb = require('./utils/db-connection');

let db;

const PORT = process.env.PORTNO || 5555;

app.use((req, res, next) => {
    console.log('attaching db object');
    req.db = db;
    next();
})

app.use(routes);

async function startServer() {
    console.log('starting server');
    db = await connectToDb();
    app.listen(PORT, () => {
        console.log('listening on port '+ PORT);
    })    
}

startServer();

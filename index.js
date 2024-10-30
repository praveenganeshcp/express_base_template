const express = require('express');
const app = express();
const routes = require('./routes');
const connectToDb = require('./utils/db-connection');
const config = require('./config');

let db;

const PORT = config.PORT

app.use((req, res, next) => {
    console.log('attaching db object');
    req.db = db;
    next();
})

app.use(routes);

async function startServer() {
    console.log('starting server');
    db = await connectToDb(`api-crud-${config.API_ID}`, config.DB_URL);
    app.listen(PORT, () => {
        console.log('listening on port '+ PORT);
    })    
}

startServer();

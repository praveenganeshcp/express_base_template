const express = require('express');
require('dotenv').config();
const app = express();
const routes = require('./routes');

const PORT = process.env.PORTNO;

app.use(routes);

app.listen(PORT, () => {
    console.log('listening on port '+ PORT);
})

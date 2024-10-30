const { MongoClient } = require('mongodb');

module.exports = async function connectToDb(dbName, dbUrl) {
    console.log('connecting to db '+dbName)
    const client = new MongoClient(dbUrl);
    const connection = await client.connect();
    console.log('connected to app db');
    const db = connection.db(dbName);
    return db;
}
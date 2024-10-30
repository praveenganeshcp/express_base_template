const { MongoClient } = require('mongodb');

module.exports = async function connectToDb() {
    const dbUrl = process.env.DB_URL;
    const dbName = `api-assist-${process.env.APP_ID}`;
    console.log('connecting to db '+dbName)
    const client = new MongoClient(dbUrl);
    const connection = await client.connect();
    console.log('connected to app db');
    const db = connection.db(dbName);
    return db;
}
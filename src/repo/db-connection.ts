import { MongoClient } from "mongodb";

export default async function connectToDb(dbName: string, dbUrl: string) {
  console.log("connecting to db " + dbName);
  const client = new MongoClient(dbUrl);
  const connection = await client.connect();
  console.log("connected to app db");
  const db = connection.db(dbName);
  return db;
}

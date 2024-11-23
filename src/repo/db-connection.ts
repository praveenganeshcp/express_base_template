import { MongoClient } from "mongodb";

export default async function connectToDb(dbName: string, dbUrl: string) {
  console.log("connecting to database...");
  const client = new MongoClient(dbUrl);
  const connection = await client.connect();
  console.log("connected to database");
  const db = connection.db(dbName);
  return db;
}

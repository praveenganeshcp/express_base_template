import Container from "typedi";
import { CONFIG } from "@commons/config";
import connectToDb from "@repo/db-connection";
import { APP_ID, DATABASE, DB_NAME } from "@commons/tokens";

export async function setupContainer() {
  const dbName = `api-assist-${CONFIG.API_ID}`;
  Container.set(DB_NAME, dbName);
  const dbInstance = await connectToDb(
    dbName,
    CONFIG.DB_URL,
  );
  Container.set(DATABASE, dbInstance);
  Container.set(APP_ID, CONFIG.API_ID);
}

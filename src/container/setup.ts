import Container from "typedi";
import { CONFIG } from "@commons/config";
import connectToDb from "@repo/db-connection";
import { DATABASE } from "@commons/tokens";

export async function setupContainer() {
    const dbInstance = await  connectToDb(`api-assist-${CONFIG.API_ID}`, CONFIG.DB_URL);
    Container.set(DATABASE, dbInstance);
}
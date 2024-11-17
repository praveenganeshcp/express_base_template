import { Usecase } from "@commons/types";
import { Service } from "typedi";
import { buildMigrationConfig } from "./utils";
import { config, database, down, status } from "migrate-mongo";

@Service()
export class RevertMigrationUsecase
  implements Usecase<void, void>
{
  
  async execute(): Promise<void> {
    console.log("reverting migration");
    const migrationConfig = buildMigrationConfig();
    config.set(migrationConfig);
    const { db, client } = await database.connect();
    console.log("connected to db");
    await down(db, client);
    console.log("migration reverted");
    const migrationStatus = await status(db);
    migrationStatus.forEach(({ fileName, appliedAt }) =>
      console.log(fileName + ":" + appliedAt)
    );
    client.close();
    console.log("db connection closed");
    return;
  }
}

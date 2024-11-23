import { Usecase } from "@commons/types";
import { Service } from "typedi";
import { buildMigrationConfig } from "./utils";
import { config, database, status, up } from "migrate-mongo";


@Service()
export class ApplyMigrationUsecase
  implements Usecase<void, void>
{

  async execute(): Promise<void> {
    const migrationConfig = buildMigrationConfig();
    config.set(migrationConfig);
    console.log('applying migration');
    const { db, client } = await database.connect();
    console.log('connected to db');
    await up(db, client);
    console.log('migration applied');
    const migrationStatus = await status(db);
    migrationStatus.forEach(({ fileName, appliedAt }) =>
      console.log(fileName + " : " + appliedAt)
    );
    client.close();
    console.log("db connection closed");
  }
}

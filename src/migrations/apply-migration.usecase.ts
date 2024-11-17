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
    const { db, client } = await database.connect();
    await up(db, client);
    const migrationStatus = await status(db);
    migrationStatus.forEach(({ fileName, appliedAt }) =>
      console.log(fileName + ":" + appliedAt)
    );
    client.close();
    console.log("db connection closed");
  }
}

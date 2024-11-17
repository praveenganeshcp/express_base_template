import { CONFIG } from "@commons/config";
import { DB_NAME } from "@commons/tokens";
import { config } from "migrate-mongo";
import path from "path";
import Container from "typedi";

export function buildMigrationConfig(): config.Config {
    return {
      mongodb: {
        url: CONFIG.DB_URL,
        databaseName: Container.get(DB_NAME),
      },
      migrationsDir: path.join(process.cwd(), 'src', 'migration-files'),
      changelogCollectionName: 'changelog',
      migrationFileExtension: '.ts',
    };
  }
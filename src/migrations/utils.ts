import { CONFIG } from "@commons/config";
import { DB_NAME } from "@commons/tokens";
import { config } from "migrate-mongo";
import { join } from "path";
import Container from "typedi";

export function buildMigrationConfig(): config.Config {
    return {
      mongodb: {
        url: CONFIG.DB_URL,
        databaseName: Container.get(DB_NAME),
      },
      migrationsDir: join("/Users/praveenkumar/Documents/projects/cloud_code", CONFIG.API_ID, "dist", "migration-files"),
      changelogCollectionName: 'changelog',
      migrationFileExtension: '.js',
    };
  }
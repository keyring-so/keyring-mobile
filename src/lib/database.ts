import {open} from 'react-native-quick-sqlite';
import {DB_MIGRATIONS} from './migrations';

export const DB_NAME = 'keyring.db';

export const schemaVersion = 2; // Update this whenever you add a new migration

export const startDb = () => open({name: DB_NAME});

export const applyMigrations = (db) => {
  db.transaction(tx => {
    const result = tx.execute('PRAGMA user_version;');
    if (!result.rows) {
      console.log('No schema version found');
      return;
    }

    const currentVersion = result.rows.item(0).user_version;
    console.log(`Current schema version: ${currentVersion}`);

    DB_MIGRATIONS.filter(
      migration => migration.version > currentVersion,
    ).forEach(migration => {
      console.log(`Applying migration for version ${migration.version}`);
      migration.up(tx);
      tx.execute(`PRAGMA user_version = ${migration.version};`);
    });
  });
};

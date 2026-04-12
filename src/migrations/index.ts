import * as migration_20260404_105758_initial_schema from './20260404_105758_initial_schema';
import * as migration_20260412_075448_add_news from './20260412_075448_add_news';

export const migrations = [
  {
    up: migration_20260404_105758_initial_schema.up,
    down: migration_20260404_105758_initial_schema.down,
    name: '20260404_105758_initial_schema',
  },
  {
    up: migration_20260412_075448_add_news.up,
    down: migration_20260412_075448_add_news.down,
    name: '20260412_075448_add_news'
  },
];

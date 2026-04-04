import * as migration_20260402_170310_init from './20260402_170310_init';

export const migrations = [
  {
    up: migration_20260402_170310_init.up,
    down: migration_20260402_170310_init.down,
    name: '20260402_170310_init'
  },
];

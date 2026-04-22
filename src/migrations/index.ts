import * as migration_20260404_105758_initial_schema from './20260404_105758_initial_schema';
import * as migration_20260412_075448_add_news from './20260412_075448_add_news';
import * as migration_20260412_102713_make_top_page_pickups_image_optional from './20260412_102713_make_top_page_pickups_image_optional';
import * as migration_20260416_125350_add_news_important_select from './20260416_125350_add_news_important_select';

export const migrations = [
  {
    up: migration_20260404_105758_initial_schema.up,
    down: migration_20260404_105758_initial_schema.down,
    name: '20260404_105758_initial_schema',
  },
  {
    up: migration_20260412_075448_add_news.up,
    down: migration_20260412_075448_add_news.down,
    name: '20260412_075448_add_news',
  },
  {
    up: migration_20260412_102713_make_top_page_pickups_image_optional.up,
    down: migration_20260412_102713_make_top_page_pickups_image_optional.down,
    name: '20260412_102713_make_top_page_pickups_image_optional',
  },
  {
    up: migration_20260416_125350_add_news_important_select.up,
    down: migration_20260416_125350_add_news_important_select.down,
    name: '20260416_125350_add_news_important_select'
  },
];

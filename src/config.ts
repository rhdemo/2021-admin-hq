'use strict';

import { get } from 'env-var';

const config = {
  NODE_ENV: get('NODE_ENV').default('dev').asEnum(['dev', 'prod']),
  LOG_LEVEL: get('LOG_LEVEL').default('info').asString(),

  // The "npm run dev" script will set these to admin/password. In production
  // they're auto generated on startup if not explicitly set
  ADMIN_USERNAME: get('ADMIN_USERNAME').asString(),
  ADMIN_PASSWORD: get('ADMIN_PASSWORD').asString(),

  // HTTP and WebSocket traffic both use this port
  HTTP_PORT: get('HTTP_PORT').default(3001).asPortNumber(),

  DATAGRID_GAME_DATA_STORE: get('DATAGRID_GAME_DATA_STORE')
    .default('game')
    .asString(),
  DATAGRID_PLAYER_DATA_STORE: get('DATAGRID_PLAYER_DATA_STORE')
    .default('players')
    .asString(),

  // Game data is always in a fixed and key, whereas players and
  // game instances use randomly generated keys/ids
  DATAGRID_GAME_DATA_KEY: get('DATAGRID_GAME_DATA_KEY')
    .default('current-game')
    .asString(),

  DATAGRID_HOST: get('DATAGRID_HOST').default('infinispan').asString(),
  DATAGRID_HOTROD_PORT: get('DATAGRID_HOTROD_PORT')
    .default(11222)
    .asPortNumber()
};

export = config;

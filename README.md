# 2021 Game Admin HQ

Provides the ability to monitor and change game state.

## Usage

### Local Development

_NOTE: Local development requires that Infinispan is started using the script(s) in the [2021-frontend-wss](https://github.com/rhdemo/2021-frontend-wss) repository._

```
./scripts/node.start.sh
```

### Configuration

These are defined via environment variables. The code can be found in *src/config.ts*.

* NODE_ENV: `dev` or `prod`
* LOG_LEVEL: `trace`, `debug`, or `info`
* ADMIN_USERNAME: Auto generated on startup if not set. Set to `admin` during local development.
* ADMIN_PASSWORD: Auto generated on startup if not set. Set to `password` during local development.
* HTTP_PORT: Defaults to `3001`.
* DATAGRID_HOST: `infinispan`

There's very little reason to change the following from their defaults:

* DATAGRID_GAME_DATA_STORE: `game`.
* DATAGRID_PLAYER_DATA_STORE: `players`.
* DATAGRID_GAME_DATA_KEY: `current-game`.
* DATAGRID_HOTROD_PORT: `11222`

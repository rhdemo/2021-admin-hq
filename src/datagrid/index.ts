import { DATAGRID_GAME_DATA_STORE } from "../config";
import { Subject } from 'rxjs'
import getDataGridClientForCacheNamed from "./client";
import { ClientEvent, InfinispanClient } from "infinispan";

export type CacheEvent = {
  cacheName: string
  event: {
    type: ClientEvent,
    key: string
  }
}

export type GameDataLayer = {
  client: InfinispanClient
  subject: Subject<CacheEvent>
}

const pendingGameClient = initialiseGameDataLayer()

export const getGameDataLayer = () => pendingGameClient

async function initialiseGameDataLayer (): Promise<GameDataLayer> {
  const client = await getDataGridClientForCacheNamed(DATAGRID_GAME_DATA_STORE)
  const subject = new Subject<CacheEvent>()

  const listenerId = await client.addListener('create', (key, version, id) =>
    subject.next({
      cacheName: DATAGRID_GAME_DATA_STORE,
      event: {
        type: 'create',
        key
      }
    })
  );

  await client.addListener(
    'modify',
    (key) => subject.next({
      cacheName: DATAGRID_GAME_DATA_STORE,
      event: {
        type: 'modify',
        key
      }
    }),
    { listenerId }
  );

  await client.addListener(
    'remove',
    (key) => subject.next({
      cacheName: DATAGRID_GAME_DATA_STORE,
      event: {
        type: 'remove',
        key
      }
    }),
    { listenerId }
  );

  return {
    client,
    subject
  }
}

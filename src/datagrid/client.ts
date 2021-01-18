import { InfinispanClient, InfinispanNode } from 'infinispan';
import { DATAGRID_HOST, DATAGRID_HOTROD_PORT } from '../config';
import infinispan from 'infinispan';
import log from '../log';

async function getClient(
  nodes: InfinispanNode[],
  cacheName: string
): Promise<InfinispanClient> {
  const client = await infinispan.client(nodes, {
    cacheName
  });
  log.info(`connected to infinispan for "${cacheName}" cache`);

  await client.connect()
  const stats = await client.stats();
  log.info(`stats for "${cacheName}":\n`, JSON.stringify(stats, null, 2));

  return client;
}

export default async function getDataGridClientForCacheNamed(
  cacheName: string,
): Promise<InfinispanClient> {
  log.info(`creating infinispan client for cache named "${cacheName}"`);

  const nodes = [
    {
      host: DATAGRID_HOST,
      port: DATAGRID_HOTROD_PORT
    }
  ];

  const client = await getClient(nodes, cacheName);

  return client;
}

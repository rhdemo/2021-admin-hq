import startServer from './server';
import log from './log';
import { ADMIN_PASSWORD, ADMIN_USERNAME } from './config';

async function main() {
  log.info('bootstrapping admin hq server');

  const app = await startServer(ADMIN_USERNAME, ADMIN_PASSWORD);
}

main();

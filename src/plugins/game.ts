import { randomBytes } from 'crypto';
import { FastifyPluginCallback, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { DATAGRID_GAME_DATA_KEY } from '../config';
import { getGameDataLayer } from '../datagrid';

export interface GamePluginOptions {
  username: string
  password: string
}

enum GameState {
  Lobby = 'lobby',
  Active = 'active',
  Paused = 'paused',
  Stopped = 'stopped'
}

type GameConfigurationData = {
  uuid: string;
  date: string;
  state: GameState
};

const healthPlugin: FastifyPluginCallback<GamePluginOptions> = (
  server,
  options,
  done
) => {

  server.route({
    method: 'POST',
    url: '/game/reset',
    preHandler: server.auth([server.basicAuth]),
    handler: async (req, reply) => {
      const dal = await getGameDataLayer()

      await dal.client.put(DATAGRID_GAME_DATA_KEY, JSON.stringify({
        uuid: randomBytes(8).toString('hex'),
        date: new Date().toJSON(),
        state: GameState.Lobby
      }))

      return reply.send('ok')
    }
  })
  server.route({
    method: 'PUT',
    url: '/game/:state',
    preHandler: server.auth([server.basicAuth]),
    handler: async (request, reply) => {
      const state = (request.params as any).state as GameState

      if (Object.values(GameState).includes(state)) {
        const dal = await getGameDataLayer()
        const gameJsonString = await dal.client.get(DATAGRID_GAME_DATA_KEY)

        if (!gameJsonString) {
          throw new Error('game state was not found in infinispan, so it cannot be modified')
        }

        const currentGameState: GameConfigurationData = JSON.parse(gameJsonString)
        currentGameState.state = state

        server.log.info('writing new game state: %j', currentGameState)
        await dal.client.put(DATAGRID_GAME_DATA_KEY, JSON.stringify(currentGameState))

        return reply.send('ok')
      } else {
        server.log.info(`attempted to change game state, but was passed invalid state of "${state}"`)
        return reply.view('./templates/error.hbs')
      }
    }
  });

  done();
};

export default fp(healthPlugin);

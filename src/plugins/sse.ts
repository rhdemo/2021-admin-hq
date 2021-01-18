import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import * as sse from 'fastify-sse'
import { OutgoingMessage } from 'http';
import { DATAGRID_GAME_DATA_KEY } from '../config';
import { getGameDataLayer } from '../datagrid';
import game from './game';

export interface SsePluginOptions {}

enum MessageTypes {
  Heartbeat = 'heartbeat',
  GameConfig = 'game-config',
  Connected = 'connected'
}

const ssePlugin: FastifyPluginCallback<SsePluginOptions> = (
  server,
  options,
  done
) => {
  server.register(sse.default, {})

  server.route({
    method: 'GET',
    url: '/sse',
    preHandler: server.auth([server.basicAuth]),
    handler: async (request, reply) => {
      const dal = await getGameDataLayer()

      const heartbeat = () => {
        server.log.debug('sending heartbeat to client')
        send(MessageTypes.Heartbeat)
      }

      const getGameConfig = () => dal.client.get(DATAGRID_GAME_DATA_KEY)

      const send = (event: MessageTypes, data?: unknown) => {
        reply.sse({
          event,
          ts: new Date().toJSON(),
          data
        })
      }

      // Send a heartbeat every few seconds
      const interval = setInterval(heartbeat, 2500);

      // Subscribe to game config changes
      dal.subject.subscribe(async () => {
        const gameConfigJson = await getGameConfig()

        if (gameConfigJson) {
          send(MessageTypes.GameConfig, JSON.parse(gameConfigJson))
        } else {
          // TODO
          server.log.warn('game config was missing!')
        }
      })

      // Tidy up when the client disconnects
      request.socket.on('close', () => {
        server.log.debug('sse socket closed. cancelling heartbeat')
        clearInterval(interval)
      })

      // When a client connects, send the connect AND game config payloads
      send(MessageTypes.Connected)
      send(MessageTypes.GameConfig, JSON.parse(await getGameConfig() || '{}'))
    }
  });

  done();
};

export default fp(ssePlugin);

import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import 'point-of-view'

export interface ViewsPluginOptions {}

const viewsPlugin: FastifyPluginCallback<ViewsPluginOptions> = (
  server,
  options,
  done
) => {
  server.register(require('point-of-view'), {
    engine: {
      handlebars: require('handlebars')
    },
    layout: './templates/layout.hbs'
  })

  server.route({
    method: 'GET',
    url: '/',
    handler: (req, reply) => {
      reply.view('./templates/index.hbs')
    },
    preHandler: server.auth([server.basicAuth])
  })

  done();
};

export default fp(viewsPlugin);

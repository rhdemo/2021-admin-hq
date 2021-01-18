import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import basicAuth, { FastifyBasicAuthOptions } from 'fastify-basic-auth'
import fastifyAuth from 'fastify-auth'

export interface AuthPluginOptions {
  username: string
  password: string
}

const authPlugin: FastifyPluginCallback<AuthPluginOptions> = (
  server,
  options,
  done
) => {
  server.register(fastifyAuth)
  server.register(basicAuth, {
    validate: (username, password, req, reply, done) => {
      server.log.debug(`incoming username/password: ${username}/${password}`)
      server.log.debug(`expected username/password: ${options.username}/${options.password}`)

      if (username === options.username && password === options.password) {
        server.log.info('a user successfully authenticated with the server')
        done()
      } else {
        server.log.debug(`an authentication attempt failed using: ${username} / ${password}`)
        done(new Error('www authentication failed'))
      }
    },
    authenticate: true
  } as FastifyBasicAuthOptions)

  done();
};

export default fp(authPlugin);

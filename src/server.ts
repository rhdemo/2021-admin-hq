import { randomBytes } from 'crypto';
import fastify from 'fastify';
import { join } from 'path';
import { HTTP_PORT, LOG_LEVEL } from './config';
import { AuthPluginOptions } from './plugins/auth';
import 'point-of-view'
import { HealthPluginOptions } from './plugins/health';

const { version } = require('../package.json');

export default async function startServer(username?: string, password?: string) {
  const app = fastify({ logger: { level: LOG_LEVEL } });

  if (!username) {
    username = randomBytes(6).toString('hex')
    app.log.info(`generated username is "${username}"`)
  }

  if (!password) {
    password = randomBytes(6).toString('hex')
    app.log.info(`generated password is "${password}"`)
  }

  // Provides an unauthenticated health endpoint for monitoring
  app.register(require('./plugins/health'), {
    version
  } as HealthPluginOptions);

  // Exposes images and other assets
  app.register(require('fastify-static'), {
    root: join(__dirname, '../assets'),
    prefix: '/assets/',
  })

  // Configure authentication that can be applied to subsequent routes/plugins
  app.register(require('./plugins/auth'), {
    username,
    password
  } as AuthPluginOptions)

  // Server-side template rendering setup
  app.register(require('./plugins/views'))

  // Exposes live updates via server sent events
  app.register(require('./plugins/sse'))

  // Game management API endpoints
  app.register(require('./plugins/game'))

  app.setNotFoundHandler((req, reply) => {
    reply.view('./templates/error.hbs', {
      accessDenied: true,
      code: 404,
      message: 'Not Found'
    })
  })

  app.setErrorHandler(function (err, req, reply) {
    if (err.statusCode === 401) {
      app.log.warn('a user failed to authenticate')
      reply.view('./templates/access-denied.hbs', { accessDenied: true })
    } else {
      app.log.error(`error handler triggered for requestId ${req.id} with a ${err.statusCode} error`)
      reply.view('./templates/error.hbs', {
        accessDenied: true,
        code: err.statusCode || 500,
        message: err.message || 'Internal Server Error'
      })
    }
  })

  try {
    await app.listen(HTTP_PORT, '0.0.0.0');

    return app;
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

import Koa from 'koa';
import KoaRouter from 'koa-router';
import KoaBodyParser from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';
import jwt from 'koa-jwt';
import jwksRsa from 'jwks-rsa';

import nano, { createDb } from './middleware/userdb';
import schemacontent from './schemacontent';
import resolvercontent from './resolver';

// GraphQL Schema

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs: schemacontent,
  resolvers: resolvercontent,
});

// Router
const router = new KoaRouter();
router
  // GraphQL
  .get('/graphql', graphiqlKoa({ endpointURL: '/graphql'}))
  .post('/graphql', jwt({
    secret: jwksRsa.koaJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 2,
      jwksUri: 'https://lukasboehme.com:8443/auth/realms/todo/protocol/openid-connect/certs',
    }),
    issuer: 'https://lukasboehme.com:8443/auth/realms/todo',
    audience: 'app',
    algorithms: [ 'RS256' ],
    passthrough: true,
    debug: true, 
  }), (ctx, next) => nano(ctx, next), (ctx, next) => graphqlKoa({
    schema,
    context: ctx,
  })(ctx, next))
  .post('/token', jwt({
    secret: jwksRsa.koaJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 2,
      jwksUri: 'https://lukasboehme.com:8443/auth/realms/todo/protocol/openid-connect/certs',
    }),
    issuer: 'https://lukasboehme.com:8443/auth/realms/todo',
    audience: 'app',
    algorithms: [ 'RS256' ],
    passthrough: false,
    debug: true, 
  }), (ctx, next) => nano(ctx, next), (ctx) => {ctx.body = ctx.state});
const app = new Koa();

app
  .use(KoaBodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

createDb();

app.listen(3000);

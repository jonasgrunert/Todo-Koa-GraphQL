import Koa from 'koa';
import KoaRouter from 'koa-router';
import KoaBodyParser from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';
import jwt from 'koa-jwt';
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
  .get('/graphql', graphiqlKoa({ endpointURL: '/graphql' }))
  // jwt({ secret: 'shared-scret' }), (ctx) => { nano(ctx); },
  .post('/graphql', (context, next) => graphqlKoa({
    schema,
    context,
  })(context, next));

const app = new Koa();

app
  .use(KoaBodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

createDb();

app.listen(3000);

// build schema
// const schema = makeExecutableSchema({ typeDefs: schemacontent.schemacontent, resolvers: resolvercontent.resolvercontent });

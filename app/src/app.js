import Koa from 'koa';
import KoaRouter from 'koa-router';
import KoaBodyParser from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';
import schemacontent from './schemacontent';
import resolvercontent from './resolvercontent'

const app = new Koa();
const router = new KoaRouter();

app
  .use(KoaBodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);

// router
router.get('/graphql', KoaBodyParser, graphqlKoa({ endpointURL: '/graphql' }));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphiql' }));

// build schema
const schema = makeExecutableSchema({ typeDefs: schemacontent.schemacontent, resolvers: resolvercontent.resolvercontent });

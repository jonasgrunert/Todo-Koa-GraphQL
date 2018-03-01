import Koa from 'koa';
import KoaRouter from 'koa-router';
import KoaBodyParser from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';
import schemacontent from './schemacontent';

const app = new Koa();
const router = new KoaRouter();
//TEST
app
  .use(KoaBodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);

// Router
router.get('/graphql', graphiqlKoa({ endpointURL: '/graphql' }));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

router.post('/graphql', graphqlKoa({ schema }));

// GraphQL Schema
// Some fake data
const books = [
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

// declare resolvers
const resolvers = {
  Query: { books: () => books },
};

//build schema
const schema = makeExecutableSchema({typeDefs = schemacontent.schemacontent, resolvers});

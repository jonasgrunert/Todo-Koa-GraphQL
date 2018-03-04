import Koa from 'koa';
import KoaRouter from 'koa-router';
import KoaBodyParser from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';
import jwt from 'koa-jwt';
import nano, { createDb } from './middleware/userdb';

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

// The GraphQL schema in string form
const typeDefs = `
  type Query { books: [Book] }
  type Book { title: String, author: String }
`;

// The resolvers
const resolvers = {
  Query: { books: () => books },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Router
const router = new KoaRouter();
router
  // GraphQL
  .get('/graphql', graphiqlKoa({ endpointURL: '/graphql' }))
  .post('/graphql', jwt({ secret: 'shared-scret' }), (ctx) => { nano(ctx); }, (ctx) => { graphqlKoa({ schema, context: ctx }); });

const app = new Koa();

app
  .use(KoaBodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

createDb();

app.listen(3000);

// build schema
// const schema = makeExecutableSchema({ typeDefs: schemacontent.schemacontent, resolvers: resolvercontent.resolvercontent });

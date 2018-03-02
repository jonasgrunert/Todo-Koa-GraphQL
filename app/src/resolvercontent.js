// resolvercontent.js
// https://www.apollographql.com/docs/graphql-tools/generate-schema.html
// https://ideas.mightymaker.io/graphql-and-apollo-resolvers-fa0ad72bb144

const resolvercontent = {
  Query: {
    categories([category]) {
      return find(categories, { id: args.id });
    },
  },
};

export default resolvercontent

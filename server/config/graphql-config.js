const { graphqlHTTP } = require('express-graphql');
const graphqlMethods = require('../graphql')

const graphqlHttpCONFIG = graphqlHTTP({
  schema: graphqlMethods.schema,
  rootValue: graphqlMethods.resolvers,
  graphiql: true,
  customFormatErrorFn(err) {
    if (!err.originalError) {
      return err;
    }
    const data = err.originalError.data;
    const message = err.message || 'An error occurred.';
    const code = err.originalError.code || 500;
    return {
      message: message,
      path: err.path,
      status: code,
      data: data,
      stack: err.stack ? err.stack.split('\n') : [],
    };
  },
});


module.exports = graphqlHttpCONFIG;
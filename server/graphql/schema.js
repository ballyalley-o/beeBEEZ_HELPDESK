const { buildSchema } = require('graphql');


module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String
        Posts: [Post!]!
    }

    type RootQuery {
        hello: String
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }
    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
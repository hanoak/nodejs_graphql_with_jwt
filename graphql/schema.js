const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Book {
        _id: ID!
        name: String!
        author: String!
        price: String!
    }

    type BookData {
        books: [Book!]!
    }

    type RootQuery {
        auth(email: String!, password: String!): {token: String}!
        get(): BookData!
        getSingle(id: ID!): Book! 
    }

    schema {
        query: RootQuery
    }
`);
const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Book {
        _id: ID!
        name: String!
        author: String!
        price: String!
    }

    type postData {
        name: String!
        author: String!
        price: String!
    }

    type BookData {
        books: [Book!]!
    }

    type returnString {
        message: String!
    }

    type RootQuery {
        auth(email: String!, password: String!): {token: String}!
        get(): BookData!
        getSingle(id: ID!): Book! 
    }

    type RootMutation {
        createBook(userInput: postData):  returnString!
        updateBook(id: ID!, userInput: postData): returnString!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
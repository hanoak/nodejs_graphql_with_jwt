const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Book {
        _id: ID!
        name: String!
        author: String!
        price: Int!
    }

    input postData {
        name: String!
        author: String!
        price: Int!
    }

    type BookData {
        books: [Book!]!
    }

    type returnString {
        message: String!
    }
    type tokenType {
        token: String!
    }

    type RootQuery {
        auth(email: String!, password: String!): tokenType!
        get: BookData!
        getSingle(id: ID!): Book! 
    }

    type RootMutation {
        createBook(userInput: postData):  returnString!
        updateBook(id: ID!, userInput: postData): returnString!
        deleteBook(id: ID!): returnString!
        
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
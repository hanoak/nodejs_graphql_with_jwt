const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/user');
const Book = require('../models/book');

module.exports = {
    
    auth: async function({ email, password }) {
        
        let errors = [];
        if(! validator.isEmail(email)) {
            errors.push({message: "Invalid Email"});
        }
        if(! (validator.isLength(password, { min: 6}) || validator.isAlphanumeric(password)) ) {
            errors.push({message: "Invalid Password"});
        }

        if (errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const user = await User.findOne({email: email});

        if(! user) {
            const err = new Error('Email not found!');
            err.code = 401;
            err.data = {email: email, password: password};
            throw err;
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if(! isEqual) {
            const err = new Error('Wrong password!');
            err.code = 401;
            err.data = {email: email, password: password};
            throw err;
        }

        const token = jwt.sign({uid: user._id.toString()}, 'YourSecretKeyGoesHere123', { expiresIn: '1h' });
        return {token: token};

    },
    get: async function(args, req) {
        if(! req.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 402;
            throw error;
        }

        const books = await Book.find();
        
        if (!books) {
            const error = new Error('No books found!');
            error.code = 404;
            throw error;
        }

        return {
            books: books.map( book => {
                return { ...book._doc, _id: book._id.toString() };
            })
        }
    },
    getSingle: async function({ id }, req) {
        if(! req.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 402;
            throw error;
        }

        if (! validator.isMongoId(id.toString())) {
            const error = new Error('Invalid ID');
            error.code = 402;
            throw error;
        }

        const book = await Book.findById(id);
        
        if (!book) {
            const error = new Error('No book found!');
            error.code = 404;
            throw error;
        }

        return { ...book._doc, _id: book._id.toString() };

    },
    createBook: async function({ userInput }, req) {
        if(! req.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 402;
            throw error;
        }

        let errors = [];
        if(! validator.isLength(userInput.name, { min: 4}) ) {
            errors.push({message: "Invalid book's name"});
        }
        if(! validator.isLength(userInput.author, { min: 4})) {
            errors.push({message: "Invalid author's name"});
        }
        if(! validator.isNumeric(userInput.price.toString()) ) {
            errors.push({message: "Invalid price"});
        }

        if (errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const book = new Book({
            name: userInput.name,
            author: userInput.author,
            price: userInput.price
        });
    
        await book.save();
        return { message: 'Book successfully created!'};

    },
    updateBook: async function({ id, userInput }, req)  {
        if(! req.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 402;
            throw error;
        }

        let errors = [];
        
        if(! validator.isLength(userInput.name, { min: 4})) {
            errors.push({message: "Invalid book's name"});
        }
        if(! validator.isLength(userInput.author, { min: 4})) {
            errors.push({message: "Invalid author's name"});
        }
        if(! validator.isNumeric(userInput.price.toString()) ) {
            errors.push({message: "Invalid price"});
        }

        if (errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        if (! validator.isMongoId(id.toString())) {
            const error = new Error('Invalid ID');
            error.code = 402;
            throw error;
        }

        const book = await Book.findById(id);

        if(! book) {
            const error = new Error('Could not find book.');
            error.code = 404;
            throw error;
        }

        book.name = userInput.name;
        book.author = userInput.author;
        book.price = userInput.price;

        const result = await book.save();
        return { message: 'Book updated!', book: result };

    },
    deleteBook: async function({ id }, req)  {
        if(! req.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 402;
            throw error;
        }

        if (! validator.isMongoId(id.toString())) {
            const error = new Error('Invalid ID');
            error.code = 402;
            throw error;
        }
        
        const book = await Book.findById(id);

        if(! book) {
            const error = new Error('Could not find book.');
            error.code = 404;
            throw error;
        }

        await Book.findByIdAndRemove(id);
        return { message: 'Book deleted.'};
    }
}
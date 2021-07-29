const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/user');
const Book = require('../models/book');

module.exports = {
    
    auth: function({ email, password }) {
        
        const errors;
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

        let dbuser;
        User.findOne({email: email})
            .then(user => {

                if(! user) {
                    const err = new Error('Email not found!');
                    err.code = 401;
                    err.data = {email: email, password: password};
                    throw err;
                }
                dbuser = user;
                return bcrypt.compare(password, user.password);
            })
            .then(isEqual => {

                if(! isEqual) {
                    const err = new Error('Wrong password!');
                    err.code = 401;
                    err.data = {email: email, password: password};
                    throw err;
                }

                const token = jwt.sign({
                    uid: dbuser._id.toString(),                
                }, 'YourSecretKeyGoesHere123', {
                    expiresIn: '1h'
                });

                return {token: token};
            })
            .catch(err => {
                if(! err.code) {
                    err.code = 500;
                }
                throw err;
            });

    },
    get: function(args, req) {
        if(! req.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 402;
            throw error;
        }

        Book.find()
        .then(books => {

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

        })
        .catch(err => {
            if(! err.code) {
                err.code = 500;
            }
            throw err;
        });
    },
    getSingle: function({ id }, req) {
        if(! req.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 402;
            throw error;
        }

        Book.findById(id)
        .then(book => {

            if (!book) {
                const error = new Error('No books found!');
                error.code = 404;
                throw error;
            }

            return { ...book._doc, _id: book._id.toString() };

        })
        .catch(err => {
            if(! err.code) {
                err.code = 500;
            }
            throw err;
        });
    },
    createBook: function({ userInput }, req) {
        if(! req.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 402;
            throw error;
        }

        const errors;
        const returnString;
        if(! (validator.isString(userInput.name) || validator.isLength(userInput.name, { min: 4})) ) {
            errors.push({message: "Invalid book's name"});
        }
        if(! (validator.isString(userInput.author) || validator.isLength(userInput.author, { min: 4})) ) {
            errors.push({message: "Invalid author's name"});
        }
        if(! validator.isNumeric(userInput.price) ) {
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
    
        book.save()
            .then(result => {
                returnString = { message: 'Book successfully created!'};
            })
            .catch(err => {
                if(! err.code) {
                    err.code = 500;
                }
                throw err;
            });

            return returnString;

    },
    updateBook: function({ id, userInput }, req)  {
        if(! req.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 402;
            throw error;
        }

        const errors;
        const returnString;
        if(! (validator.isString(userInput.name) || validator.isLength(userInput.name, { min: 4})) ) {
            errors.push({message: "Invalid book's name"});
        }
        if(! (validator.isString(userInput.author) || validator.isLength(userInput.author, { min: 4})) ) {
            errors.push({message: "Invalid author's name"});
        }
        if(! validator.isNumeric(userInput.price) ) {
            errors.push({message: "Invalid price"});
        }

        if (errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        Book.findById(id)
        .then(book => {

            if(! book) {
                const error = new Error('Could not find book.');
                error.statusCode = 404;
                next(error);
            }

            book.name = req.body.name;
            book.author = req.body.author;
            book.price = req.body.price;

            return book.save();

        })
        .then(result => {
            returnString = { message: 'Book updated!', book: result };
        })
        .catch(err => {
            if(! err.code) {
                    err.code = 500;
                }
            throw err;
        });

        return returnString;

    },
    deleteBook: function({ id }, req)  {
        if(! req.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 402;
            throw error;
        }

        const returnString;
        Book.findById(id)
        .then(book => {

            if(! book) {
                const error = new Error('Could not find book.');
                error.statusCode = 404;
                next(error);
            }

            return Book.findByIdAndRemove(id);
        })
        .then(result => {
            returnString = { message: 'Book deleted.' };
        })
        .catch(err => {
            if(! err.statusCode) {
                err.statusCode = 500;
                next(err);
            }
        });

        return returnString;
    }
}
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
    }
}
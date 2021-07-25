const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const authHeader = req.get('Authorization');

    if(!authHeader) {
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(' ')[1];
    let dtoken;
    try{
        dtoken = jwt.verify(token, 'YourSecretKeyGoesHere123');
    } catch(err) {
        req.isAuth = false;
        return next();
    }

    if(! dtoken) {
        req.isAuth = false;
        return next();
    }
    
    req.isAuth = true;
    next();

};
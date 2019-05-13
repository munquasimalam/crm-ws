/**
 * Require Dependencies
 */
    const  mongoose = require('mongoose');
    const log = require('./logger');
    const mongoUrl = require('../config/config').mongoUrl;
    const mongoDB = {};

/**
 * Connect to Mongo Database
 */
mongoDB.init = function(){  
    mongoose.connect(mongoUrl, {useCreateIndex: true,useNewUrlParser: true }, err => {
        if (err) {
            log.error("mongo connection lost: " + err);
            return
        }

        log.info("mongo connection done.");
        
        const db = mongoose.connection;
        return db;
    });
}



module.exports = mongoDB;

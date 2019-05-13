const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
// var plugins = require('restify').plugins;
const config = require('../config/config');
const log = require('./logger');

// init server 
let restifyServer = {};

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ['*'],
    allowHeaders: ['Authorization','Content-Type', 'accept-version'],
    exposeHeaders: ['API-Token-Expiry']
});

/*
init function definition
*/
restifyServer.init = function(){

    restifyServer.server = restify.createServer({
        name: 'patientAPI'
    });
    restifyServer.server.use(restify.plugins.bodyParser({ mapParams: false })); //for body data 
    restifyServer.server.use(restify.plugins.queryParser());//for query params 

    //preflight setting
    restifyServer.server.pre(cors.preflight);
    restifyServer.server.use(cors.actual);

    //Api Request Log
    restifyServer.server.pre((req,res, next)=>{
        // console.log(req.headers);
        log.apiRequestLog(req);
        return next()
    });
    //Api Response Log
    restifyServer.server.on('after',(req,res, route)=>{   
        log.apiResponseLog({req,res,route});
    });

    //restify server start
    restifyServer.server.listen(config.port,()=>{    
        require('./routes')(restifyServer.server, restify);
        log.info("Server started on port: " + config.port);
    });
}

module.exports = restifyServer;

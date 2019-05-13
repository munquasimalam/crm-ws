const log = require('./logger');
const execParamQuery = require('./mysql').execParamQuery;
const loginQuery = require('./sql').login
const jwtSign = require('jsonwebtoken').sign;
const jwtVerify = require('jsonwebtoken').verify;

// auth init
const auth = {};

/*
    Version 1 Login handler
*/
auth.loginV1Handler = async function(req,res,next){
    log.debug("auth.js, Handlers: loginV1Handler");
    const username = req.body.username, password = req.body.password;
    //check if username password present
    if(typeof(username) != "string" || typeof(password) != "string"){
        res.send(400, {error: "No Data found"});
        return next();
    }
    const loginQuery = require('./sql').login.v1.query;
    commonHandler(req,res,next,loginQuery,[username,password]);
    
}

/*
    Version 3 Login handler
    Getting value from new Registration
*/
auth.loginV2Handler = function(req,res,next){
    log.debug("auth.js, Handlers: loginV2Handler");
    const login_name = req.body.username, login_password = req.body.password;
    mongoHandler(req,res,next,login_name,login_password);
}

/*
    generate token if valid user 
    @params: user_id, user_label
*/
function getToken(user){
    const token = jwtSign(user,"PatientAPIKey");
    return token;
}

/*
    verify token if valid user 
    @params: token
*/
function verfiyToken(token, next){
    if(!token) return next("NOTOKEN");
    jwtVerify(token, 'PatientAPIKey', function(err, data) {
        if (err) return next("INVALIDTOKEN")
        else return next(null, data)
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
auth.isAuthenticate = function (req,res,next){
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
      verfiyToken(bearerHeader,(err,user)=>{
          if(err) return res.send(403, err);
          req.user = user;
          return next();
      })
    } else {
      res.send(403,"NoToken");
    }
}

/*
    commonHandler for all request to get record from DB and sending response 
    @params:    req: request object, 
                res: response object, 
                next: callback method, 
                query: DB to execute, 
                params: Filter params for the query
*/
async function commonHandler(req,res,next,query,params){
    const execParamQuery = require('./mysql').execParamQuery;
    try {
        //getting actual data from mysql to check user data
        let result = await execParamQuery(query,params);
        // if data exist and record found
        if(typeof result != "undefined" && result.length) {
            log.debug("auth.js, getToken")
            // generate token and add to result
            result[0].token = getToken({user_id: result[0].user_id, user_label: result[0].user_label});
            // return 200 status
            res.send(200, {data: result[0]});
            
        }
        //no data found in DB return 400 status code with error
        else res.send(400, {error: "No Data found"}); //ToDo Error Code
        //go to after handler
        return next();
    } catch (error) {
        log.error(error);
        //error when getting data from mysql DB
        res.send(400, {error}); //ToDo Error Code
        //go to after handler
        return next();
    }
}


async function mongoHandler(req,res,next,username,password) {
    const users = require('./models/user');
    try {
        //get user from user collection
        result = await users.findOne({username,password},{});
         // if data exist and record found
         if(typeof result != "undefined") {
            log.debug("auth.js, getToken")
            // generate token and add to result
            result.token = getToken({user_id: result.username, password: result.password});
            // return 200 status
            res.send(200, {data: result});
            
        }
        //no data found in DB return 400 status code with error
        else res.send(400, {error: "No Data found"}); //ToDo Error Code
        //go to after handler
        return next();
    } catch (error) {
        log.error(error);
        //error when getting data from mysql DB
        res.send(400, {error}); //ToDo Error Code
        //go to after handler
        return next();
    }
}



module.exports = auth;

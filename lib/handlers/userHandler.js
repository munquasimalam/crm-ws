const log = require('../logger');
const userModel = require('../models/user');

// user init
const user = {};

/*
    createUserHandler create new user in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

user.createUserHandler = async function (req, res, next) {
    log.info("userHandler.js, Handlers: createUserHandler")
    let userObj = {};
    userObj.userName = req.body.userName;
    userObj.password = req.body.password;
    userObj.activeDate = req.body.activeDate;
    userObj.activeStatus = req.body.activeStatus;
    userObj.userLabel = req.body.userLabel;
    userObj.userType = req.body.userType;
    userObj.office = req.body.office;

    try {
        result = await userModel.createUser(userObj);
        // if data exist and record found
        if (typeof result != "undefined") {
            res.send(200, { data: result });
        }
        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No User created" }); //ToDo Error Code
        //go to after handler
        return next();
    } catch (error) {
        log.error(error);
        //error when getting data from mysql DB
        res.send(400, { error }); //ToDo Error Code
        //go to after handler
        return next();
    }
}

/*
    getOneUserHandler find all user from  DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

user.getOneUserHandler = async function (req, res, next) {
    log.info("userHandler.js, Handlers: getOneUserHandler");
     try {
        //get user from user collection
        result = await userModel.findOneUser({_id: req.params.id},{});
        // if data exist and record found
        if (typeof result != "undefined") {
            log.debug("auth.js, getToken")
            // generate token and add to result

            res.send(200, { data: result });

        }
        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No User Found" }); //ToDo Error Code
        //go to after handler
        return next();
    } catch (error) {
        log.error(error);
        //error when getting data from mysql DB
        res.send(400, { error }); //ToDo Error Code
        //go to after handler
        return next();
    }
}

/*
    updateUserHandler update existing  user in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

user.updateUserHandler = async function (req, res, next) {
    log.info("userHandler.js, Handlers: updateUserHandler")
    let userObj = {};
    let id = req.params.id;
    if (!id) {
        //no id found
        res.send(400, { error: "No ID Found" });
        //go to after handler
        return next();
    }
    if (req.body.activeDate) userObj.activeDate = req.body.activeDate;
    if (req.body.activeStatus) userObj.activeStatus = req.body.activeStatus
    if (req.body.userLabel) userObj.userLabel = req.body.userLabel
    if (req.body.userType) userObj.userType = req.body.userType
    if (req.body.office) userObj.office = req.body.office;

    try {
        result = await userModel.updateUser(id, userObj);
        // if data exist and record found
        if (typeof result != "undefined") {
            res.send(200, { data: result });

        }
        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No User Found" }); //ToDo Error Code
        //go to after handler
        return next();
    } catch (error) {
        log.error(error);
        //error when getting data from mysql DB
        res.send(400, { error }); //ToDo Error Code
        //go to after handler
        return next();
    }
}
/*
    searchUserHandler search user from the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

user.searchUserHandler = async function (req, res, next) {
    log.info("userHandler.js, Handlers: updateUserHandler")
    let condition = {};
    if (req.query.userName) condition.userName = req.query.userName;
    if (req.query.userLabel) condition.userLabel = req.query.userLabel;
    if (req.query.activeStatus) condition.activeStatus = req.query.activeStatus;
    if (req.query.userId) condition._id = req.query.userId;

    try {
         result = await userModel.searchUser(condition, {});
        // if data exist and record found
        if (typeof result != "undefined") {
            res.send(200, { data: result });

        }
        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No User Found" }); //ToDo Error Code
        //go to after handler
        return next();
    } catch (error) {
        log.error(error);
        //error when getting data from mysql DB
        res.send(400, { error }); //ToDo Error Code
        //go to after handler
        return next();
    }
}

module.exports = user;

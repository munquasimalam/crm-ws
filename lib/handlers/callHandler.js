const log = require('../logger');
const moment = require('moment');
const callModel = require('../models/call');
const remarkModel = require('../models/remark');

//  init callHandler
const callHandler = {};

/*
    createCallHandler create new call in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

callHandler.createCallHandler = async function (req, res, next) {
    log.info("callHandler.js, Handlers: createCallHandler")
    let callObj = {};
    if (req.body.message) callObj.message = req.body.message;
    if (req.body.createdBy) callObj.createdBy = req.body.createdBy;
    if (req.body.mobile) callObj.mobile = req.body.mobile;
    if (req.body.customerInfo) callObj.customerInfo = req.body.customerInfo;
    if (req.body.source) callObj.source = req.body.source;
    if (req.body.callType) callObj.callType = req.body.callType;
    if (req.body.followupDate) callObj.followupDate = moment(req.body.followupDate).format("DD-MM-YYYY");
    if (req.body.status) callObj.status = req.body.status;
    if (req.body.alertType) callObj.alertType = req.body.alertType;
    try {
        log.debug("getting call obejct to create" + JSON.stringify(callObj))
        callResult = await callModel.createCall(callObj);
        
        let remarkData = {documentId:callResult._id,
            remark:req.body.remark,
            collectionName:'call',
            createdBy:'101'
        }

      if(req.body.remark)  remarkResult = await remarkModel.createRemark(remarkData);
      let results = {
        callResult,remarkResult
      }
        // if data exist and record found
        if (typeof results != "undefined") {
            res.send(200, { data: results });

        }
        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No call created" }); //ToDo Error Code
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
    getOneCallHandler find one call from  DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

callHandler.getOneCallHandler = async function (req, res, next) {
    log.info("callHandler.js, Handlers: getOneCallHandler");
    try {
        //get clall from call collection
        result = await callModel.findOneCall({ _id: req.params.id }, {});
        // if data exist and record found
        if (typeof result != "undefined") {
            // generate token and add to result

            res.send(200, { data: result });

        }
        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No call Found" }); //ToDo Error Code
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
    updateCallHandler update an existing call in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

callHandler.updateCallHandler = async function (req, res, next) {
    log.info("callHandler.js, Handlers: updateCallHandler")
    let id = req.params.id;
    if (!id) {
        //no id found
        res.send(400, { error: "No ID Found" });
        //go to after handler
        return next();
    }
    
    let callObj = {};
    if (req.body.message) callObj.message = req.body.message;
    if (req.body.createdBy) callObj.createdBy = req.body.createdBy;
    if (req.body.mobile) callObj.mobile = req.body.mobile;
    if (req.body.customerInfo) callObj.customerInfo = req.body.customerInfo;
    if (req.body.source) callObj.source = req.body.source;
    if (req.body.callType) callObj.callType = req.body.callType;
    if (req.body.followupDate) callObj.followupDate =  moment(req.body.followupDate).format("DD-MM-YYYY");
    if (req.body.status) callObj.status = req.body.status;
    if (req.body.alertType) callObj.alertType = req.body.alertType;

    try {
        //get call from call collection
        result = await callModel.updateCall(id, callObj);
        // if data exist and record found
        if (typeof result != "undefined") {
            res.send(200, { data: result });
        }
        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No call Found" }); //ToDo Error Code
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
    searchCallHandler search call in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

callHandler.searchCallHandler = async function (req, res, next) {
    log.info("callHandler.js, Handlers: searchCallHandler")
    let condition = {};
     if (req.query.mobile) condition["mobile"] = req.query.mobile;
     if (req.query.name) condition["customerInfo.name"] = req.query.name;
    if (req.query.gender) condition["customerInfo.gender"] = req.query.gender;
    if (req.query.nationality) condition["customerInfo.nationality"] = req.query.nationality;
    if (req.query.createdBy) condition["createdBy.id"] = req.query.createdBy;
    if (req.query.followupDate) condition["followupDate"] =  moment(req.query.followupDate).format("DD-MM-YYYY");
    if (req.query.status) condition["status"] = req.query.status;
    if (req.query.source) condition["source"] = req.query.source;
    if (req.query.callType) condition["callType"] = req.query.callType;
    if (req.query.alertType) condition["alertType"] = req.query.alertType;
    
    try {
         result = await callModel.searchCall(condition, {});
        // if data exist and record found
        if (typeof result != "undefined") {
            res.send(200, { data: result });

        }
        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No call Found" }); //ToDo Error Code
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

module.exports = callHandler;

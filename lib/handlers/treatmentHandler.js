const log = require('../logger');
const moment = require('moment');
const treatmentModel = require('../models/treatment');
//const consultationModel = require('../models/consultation');
const remarkModel = require('../models/remark');


// treatment init
const treatment = {};

/*
    createTreatmentHandler create new treatment in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

treatment.createTreatmentHandler = async function(req,res,next) {
    log.info("treatmentHandler.js, Handlers: createTreatmentHandler")
    let obj = {};
    if(req.body.serviceDate) obj.serviceDate = req.body.serviceDate;
    if(req.body.service) obj.services = req.body.service;
    if(req.body.status) obj.status = req.body.status;
    if(req.body.performedBy) obj.performedBy = req.body.performedBy;
    if(req.body.customerId) obj.customerId = req.body.customerId;
    if(req.body.consultationId) obj.consultationId = req.body.consultationId;           
    try {
        log.debug("getting customer obejct to create" + JSON.stringify(obj))
        treatmentResult = await treatmentModel.createTreatment(obj);

        let remarkData = {documentId:treatmentResult._id,
            remark:req.body.remark,
            collectionName:'treatment',
            createdBy:req.body.createdBy,
            customerId: req.body.customerId
        }

      if(req.body.remark)  remarkResult = await remarkModel.createRemark(remarkData);
      let results = {
        treatmentResult,remarkResult
      }

         // if data exist and record found
         if(typeof results != "undefined") {
            log.debug("auth.js, getToken")
            // generate token and add to result

            res.send(200, {data: results});
            
        }
        //no data found in DB return 400 status code with error
        else res.send(400, {error: "No Customer created"}); //ToDo Error Code
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

/*
    getOneTreatmentHandler find one treament from  DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

treatment.getOneTreatmentHandler =  async function (req, res, next) {
    log.info("treatmentHandler.js, Handlers: getOneTreatmentHandler");
     try {
        let treatmentResult = {};
        //get treatment from treatment collection by treatment id
        treatmentResult = await treatmentModel.findOneTreatment({_id: req.params.id},{});
        // createdDate = moment(customerResult.createdAt).format("DD-MM-YYYY");
       // createdTime = moment(customerResult.createdAt).format("HH:mm:ss");
        
         //get all Remarls from remark collection  by treatment id
        let remarkResult = await  remarkModel.searchRemark({customerId: req.params.id},{});
      
        const results = {
            treatmentResult, remarkResult }    
      
        // if data exist and record found
        if (typeof results != "undefined") {
            // generate token and add to result
            res.send(200, { data: results });
        }
        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No Customer Found" }); //ToDo Error Code
        //go to after handler
        return next();
    } catch (error) {
        log.error(error);
        //error when getting data from mysql DB
        res.send(400, { error:error }); //ToDo Error Code
        //go to after handler
        return next();
    }
}


/*
    updateTreatmentHandler update an existing treatment in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

treatment.updateTreatmentHandler = async function(req,res,next) {
    //const customers = require('../models/customer');
    log.info("treatmentHandler.js, Handlers: updateTreatmentHandler")
    let id = req.params.id;
    if(!id) {
        //no id found
        res.send(400, {error: "No ID Found"});
        //go to after handler
        return next();
    }
    
    let obj = {};
    if(req.body.serviceDate) obj.serviceDate = req.body.serviceDate;
    if(req.body.service) obj.services = req.body.service;
    if(req.body.status) obj.status = req.body.status;
    if(req.body.performedBy) obj.performedBy = req.body.performedBy;
    if(req.body.customerId) obj.customerId = req.body.customerId;
    if(req.body.consultationId) obj.consultationId = req.body.consultationId; 
   
    try {
        //get user from user collection
          result = await treatmentModel.updateTreatment(id,obj);
         // if data exist and record found
         if(typeof result != "undefined") {
            res.send(200, {data: result}); 
        }
        //no data found in DB return 400 status code with error
        else res.send(400, {error: "No Treatment Found"}); //ToDo Error Code
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


/*
    searchTreatmentHandler search treatment  in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/ 

treatment.searchTreatmentHandler = async function(req,res,next) {
    log.info("treatmentHandler.js, Handlers: searchTreatmentHandler")
    let condition = {};
    if(req.query.treatmentId) condition._id = req.query.treatmentId;
    if(req.query.serviceDate) condition.serviceDate = req.query.serviceDate;
    if(req.query.service) condition.services = req.query.service;
    if(req.query.status) condition.status = req.query.status;
    if(req.query.performedBy) condition.performedBy = req.query.performedBy;
    if(req.query.customerId) condition.customerId = req.query.customerId;
    if(req.query.consultationId) condition.consultationId = req.query.consultationId;
      try {  
         result = await treatmentModel.searchTreatment(condition,{});
         // if data exist and record found
         if(typeof result != "undefined") {
            res.send(200, {data: result});
            
        }
        //no data found in DB return 400 status code with error
        else res.send(400, {error: "No Treatment Found"}); //ToDo Error Code
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

module.exports = treatment;

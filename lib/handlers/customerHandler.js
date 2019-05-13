const log = require('../logger');
const moment = require('moment');
const customerModel = require('../models/customer');
const consultationModel = require('../models/consultation');
const remarkModel = require('../models/remark');


// customer init
const customer = {};

/*
    createCustomerHandler create new customer in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

customer.createCustomerHandler = async function(req,res,next) {
    log.info("customerHandler.js, Handlers: createCustomerHandler")
    let customerObj = {};
    if(req.body.demography) customerObj.demography = req.body.demography;
    if(req.body.contact) customerObj.contact = req.body.contact;
     if(req.body.coordinator) customerObj.coordinator = req.body.coordinator;
     customerObj.openFile = false;
    //customerObj.openFile = true;
    
    if(req.body.source) customerObj.source = req.body.source;
    if(req.body.createdBy) customerObj.createdBy = req.body.createdBy;
    if(req.body.officeId) customerObj.officeId = req.body.officeId; 
              
    try {
        //log.debug("getting customer obejct to create" + JSON.stringify(customerObj))
        customerResult = await customerModel.createCustomer(customerObj);

        let remarkData = {documentId:customerResult._id,
            remark:req.body.remark,
            collectionName:'custmer',
            createdBy:req.body.createdBy,
            customerId:customerResult._id
        }

      if(req.body.remark)  remarkResult = await remarkModel.createRemark(remarkData);
      let results = {
        customerResult,remarkResult
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
    getOneCustomerHandler find one customer from  DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

customer.getOneCustomerHandler =  async function (req, res, next) {
    log.info("customerHandler.js, Handlers: getOneCustomerHandler");
     try {
        let customerResult = {};
        //get customer from customer collection by customer id
       customerResult = await customerModel.findOneCustomer({_id: req.params.id},{});
       createdDate = moment(customerResult.createdAt).format("DD-MM-YYYY");
        createdTime = moment(customerResult.createdAt).format("HH:mm:ss");
       let consultResult;
       if(customerResult.consultationId) {
            //get consultation from consultation collection by consultatio Id
            consultResult = await consultationModel.findOneConsultation({_id: customerResult.consultationId},{});
        } 
         //get all Remarls from remark collection  by customer id
        let remarkResult = await  remarkModel.searchRemark({customerId: req.params.id},{});
      
        const results = {
            customerResult,
            consultResult,
            remarkResult,createdDate,createdTime
        }

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
    updateCustomerHandler update an existing customer in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

customer.updateCustomerHandler = async function(req,res,next) {
    //const customers = require('../models/customer');
    log.info("customerHandler.js, Handlers: updateCustomerHandler")
    let id = req.params.id;
    if(!id) {
        //no id found
        res.send(400, {error: "No ID Found"});
        //go to after handler
        return next();
    }
    
     let customerObj = {};
     console.log(req.body.demography);
     if(req.body.demography) customerObj.demography = req.body.demography;
     if(req.body.contact) customerObj.contact = req.body.contact;
     if(req.body.coordinator) customerObj.coordinator = req.body.coordinator;
     if(req.body.fileOpen) customerObj.fileOpen = req.body.fileOpen;
     if(req.body.source) customerObj.source = req.body.source;
     if(req.body.createdBy) customerObj.coordinator = req.body.createdBy;
     if(req.body.officeId) customerObj.officeId = req.body.officeId;
   
    try {
        //get user from user collection
          result = await customerModel.updateCustomer(id,customerObj);
         // if data exist and record found
         if(typeof result != "undefined") {
            res.send(200, {data: result}); 
        }
        //no data found in DB return 400 status code with error
        else res.send(400, {error: "No Customer Found"}); //ToDo Error Code
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
    searchCustomerHandler search customer in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/ 

customer.searchCustomerHandler = async function(req,res,next) {
    log.info("customerHandler.js, Handlers: searchCustomerHandler")
    let condition = {};
    if(req.query.fullName)  condition["demography.fullName"] =  {'$regex': '.*'+req.query.fullName+'.*',$options: 'i'};
    if(req.query.residenceId)  condition["demography.residenceId"] =  {'$regex': '.*'+req.query.residenceId+'.*',$options: 'i'};
   
    if(req.query.opNo)  condition["demography.opNo"] =  req.query.opNo;
   if(req.query.mobile)  condition["contact.mobile"] =  req.query.mobile;
     if(req.query.customerId)  condition["_id"] =  req.query.customerId;
     if(req.query.openFile)  condition.openFile =  req.query.openFile;
    
      try {  
         result = await customerModel.searchCustomer(condition,{});
         // if data exist and record found
         if(typeof result != "undefined") {
            res.send(200, {data: result});
            
        }
        //no data found in DB return 400 status code with error
        else res.send(400, {error: "No Customer Found"}); //ToDo Error Code
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
    countCustomerHandler count customer if openFile true else count Lead in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/ 

customer.countCustomerHandler = async function(req,res,next) {
    log.info("customerHandler.js, Handlers: countCustomerHandler")
    let condition = {};
    if(req.query.creatorid) condition["createdBy.id"] = parseInt(req.query.creatorid);
     if(req.query.openFile)  condition.openFile =  req.query.openFile;
      try {  
         result = await customerModel.countCustomer(condition);
         // if data exist and record found
         if(typeof result != "undefined") {
            res.send(200, {count: result});
            
        }
        //no data found in DB return 400 status code with error
        else res.send(400, {error: "No Customer OR Lead Found"}); //ToDo Error Code
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

module.exports = customer;

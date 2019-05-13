const log = require('../logger');
const moment = require('moment');
const remainderModel = require('../models/remainder');

//  init remainderHandler
const remainderHandler = {};

/*
    createRemainderHandler create new remainder in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

remainderHandler.createRemainderHandler = async function (req, res, next) {
    log.info("remainderHandler.js, Handlers: createRemainderHandlerFileOpen")

    let remainderFlag = true;
    let remainderDate = "";
    let condition = {};
    let remainderData = {};
   remainderDate = setRemainderDate(remainderDate,req);
    condition = setCondition(condition,remainderDate,req);
    try {
        remainder = await remainderModel.findOneRemainder(condition, {});
        if (remainder && remainder.type == req.body.type && remainder.data == remainderDate) {
            remainderFlag = false;
        }

        if (remainderFlag) {
            remainderData = setRemainderData(remainderData,remainderDate,req);
          
            switch (req.body.type) {
               case "FileOpen":
                    remainderData["message"] =  "File Open Remainder";
                    break;

                case "Payment":
                   remainderData["message"] =  "payment  Remainder";
                    break;

                    case "Treatment":
                    console.log("Treatment")
                    break;

                    case "Other":
                    console.log("Other")
                    break;
                    
            }


            result = await remainderModel.createRemainder(remainderData);
            // if data exist and record found
            if (typeof result != "undefined") {
                res.send(200, { data: result });

            }
        }

        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No remainder created" }); //ToDo Error Code
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
    createRemainderHandlerPayment create new remainder in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/
remainderHandler.createRemainderHandlerPayment = async function (req, res, next) {
    log.info("remainderHandler.js, Handlers: createRemainderHandlerPayment")

    let condition = {};
    if (req.body.customerId) condition.customerId = req.body.customerId;
    if (req.body.date) condition.date = moment(req.body.date).format("DD-MM-YYYY");
    if (req.body.type) condition.type = req.body.type;

    try {
        // if payment status Open
        if (req.body.status == 'Open') {
            let remainderData = {
                date: moment(req.body.date).add(6, 'days').format("DD-MM-YYYY"),
                type: req.body.type,
                status: "Open",
                message: "Payment Remainder",
                customerId: req.body.customerId,
                createdBy: req.body.createdBy
            }

            result = await remainderModel.createRemainder(remainderData);
            // if data exist and record found
            if (typeof result != "undefined") {
                res.send(200, { data: result });

            }
        }

        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No remainder created" }); //ToDo Error Code
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
    getOneRemainderHandler find one remainder from  DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

remainderHandler.getOneRemainderHandler = async function (req, res, next) {
    log.info("remainderHandler.js, Handlers: getOneRemainderHandler");
    if (!req.params.id) {
        res.send(400, { error: "No Document ID found" });
        return next();
    }
    try {
        //get remainder from remainder collection
        result = await remainderModel.findOneRemainder({ customerId: req.params.id }, {});
        // if data exist and record found
        if (typeof result != "undefined") {
            // generate token and add to result

            res.send(200, { data: result });

        }
        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No remainder Found" }); //ToDo Error Code
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
    updateRemainderHandler update an existing remainder in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

remainderHandler.updateRemainderHandler = async function (req, res, next) {
    log.info("remainderHandler.js, Handlers: updateRemainderHandler")
    let id = req.params.id;
    if (!id) {
        //no id found
        res.send(400, { error: "No ID Found" });
        //go to after handler
        return next();
    }
    let obj = {};
    if (req.body.date) obj.date = moment(req.body.date).format("DD-MM-YYYY");
    if (req.body.type) obj.type = req.body.type;
    if (req.body.status) obj.status = req.body.status;
    if (req.body.message) obj.message = req.body.message;
    if (req.body.customerId) obj.customerId = req.body.customerId;
    if (req.body.createdBy) obj.createdBy = req.body.createdBy;
    if (req.body.priviledge) obj.priviledge = req.body.priviledge;

    try {
        result = await remainderModel.updateRemainder(id, obj);
        // if data exist and record found
        if (typeof result != "undefined") {
            res.send(200, { data: result });
        }
        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No remainder Found" }); //ToDo Error Code
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
    searchRemainderHandler search remainder in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

remainderHandler.searchRemainderHandler = async function (req, res, next) {
    log.info("remainderHandler.js, Handlers: searchRemainderHandler")
    let condition = {};
    if (req.query.creatorid) condition["createdBy.id"] = parseInt(req.query.creatorid);
    if (req.query.status) condition.status = req.query.status;
    if (req.query.date) condition.date = moment(req.query.date).format("DD-MM-YYYY");
    else condition.date = moment().format("DD-MM-YYYY");
    console.log(condition);

    try {
        result = await remainderModel.searchRemainder(condition, {});
        // if data exist and record found
        if (typeof result != "undefined") {
            res.send(200, { data: result });

        }
        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No remainder Found" }); //ToDo Error Code
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
    countRemainderHandler count remainder in the DB 
    @params:    req: request object, 
                res: response object, 
                next: callback method,        
*/

remainderHandler.countRemainderHandler = async function (req, res, next) {
    log.info("remainderHandler.js, Handlers: countRemainderHandler")
    let condition = {};
    if (req.query.creatorid) condition["createdBy.id"] = parseInt(req.query.creatorid);
    if (req.query.date) condition.date = req.query.date;
    else condition.date = moment().format("DD-MM-YYYY");
    try {
        result = await remainderModel.countRemainder(condition);
        // if data exist and record found
        if (typeof result != "undefined") {
            res.send(200, { count: result });
            // res.json({ count: count });
        }

        //no data found in DB return 400 status code with error
        else res.send(400, { error: "No remainder Found" }); //ToDo Error Code
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

  function setRemainderDate(remainderDate,req){
    if(req.body.type == 'FileOpen'){
        if (req.body.date) remainderDate = moment(req.body.date, "DD-MM-YYYY").add(6, 'days').format("DD-MM-YYYY");
 
    } else if(req.body.type == 'Payment') {
        if (req.body.date) remainderDate = moment(req.body.date, "DD-MM-YYYY").format("DD-MM-YYYY");
    }
      return remainderDate;
  }

  function setCondition(condition,remainderDate,req){
    if (req.body.opNo) condition["patient.opNo"] = req.body.opNo;
    if (req.body.consultId) condition["patient.consultId"] = req.body.consultId;
    if (req.body.date) condition.date = remainderDate;
    if (req.body.type) condition.type = req.body.type;
     condition.status = 'Open';
      return condition;
  }

  function setRemainderData(remainderData,remainderDate,req){
   // let remainderData = {
        remainderData.date = remainderDate;
        remainderData.type = req.body.type;
        remainderData.status = "Open";
       // message: "File Open Remainder",
       remainderData["patient.opNo"] = req.body.opNo;
       remainderData["patient.consultId"] = req.body.consultId;
       remainderData["createdBy.id"] = req.body.createdById;
   // }
      return remainderData;
  }
  

module.exports = remainderHandler;

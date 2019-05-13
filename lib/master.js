/* masters like Doctor, Insurance, Service, Location */
const log = require('./logger');
var fs = require('fs');

//master init
const master = {};

/* get doctor list office and deparment */
master.doctorV1Handler = async function(req,res,next){
    log.debug("master.js, Handlers: doctorHandler");
    const doctorsQuery = require('./sql').doctors;

    /*  if office_id present 
            get doctors from the office 
        else ALL docotr list
    */
    if(req.params.office_id) {
        /* commonHandler to get doctors from db 
            @params:    query: doctorsQuery.v1.query, 
                        params: req.params.office_id
        */
        return commonHandler(req,res,next,doctorsQuery.v1.query, [req.params.office_id]); 
    } else{
        /* commonHandler to get ALL doctors from db 
            @params:    query: doctorsQuery.v2.query, 
                        params: none
        */
        return commonHandler(req,res,next,doctorsQuery.v2.query, []); 
    }

    
};

/*
    handler for doctorSlotsV1Handler
    @params: doctors_id, fromdate, todate
    version: v1
*/
master.doctorSlotsV1Handler = async function(req,res,next){
    log.debug("master.js, Handlers: doctorSlotsV1Handler");
    const doctorSlotQuery = require('./sql').doctors.v4.query;
    if(!req.params.doctors_id) {res.send(400, {error: "docotrs_id missing"});return next();}
    if(!req.params.fromdate) {res.send(400, {error: "fromdate missing"});return next();}
    if(!req.params.todate) {res.send(400, {error: "todate missing"});return next();}
    
    /*  commonHandler to get doctor slot from db 
        @params:    query: doctors.v4.query, 
                    params: doctors_id, fromdate, todate
    */
    return commonHandler(req,res,next,doctorSlotQuery, [req.params.doctors_id, req.params.fromdate, req.params.todate]);  
};

/* get insurar list by office */
master.insurarV1Handler = function(req,res,next){
    log.debug("master.js, Handlers: insurarV1Handler");
    const insurarQuery = require('./sql').insurar;

    /*  commonHandler to get insurar from db 
        @params:    query: insurarQuery.v1.query, 
                    params: None
    */
    return commonHandler(req,res,next,insurarQuery.v1.query, []);  
};

/* get insurar list by office */
master.servicesV1Handler = function(req,res,next){
    log.debug("master.js, Handlers: servicesV1Handler");
    // get data from service.json file
    try {
        var services = JSON.parse(fs.readFileSync('./data/service.json', 'utf8'));
        res.send(200, {data: services});
        //go to after handler
        return next();
    } catch (error) {
        console.log(error);
        res.send(400, {error: "No Data found"}); //ToDo Error Code
        //go to after handler
        return next();
    }
    
};

/*
    handler to get all offices [branch] 
    @params:    req: request object, 
                res: response object, 
                next: callback method, 
    version:    v1
*/
master.officesV1Handler = function(req,res,next){
    log.debug("master.js, Handlers: insurarV1Handler");
    const officeQuery = require('./sql').offices;

    /* commonHandler to get offices from db 
        @params:    query: insurarQuery.v1.query, 
                    params: None
    */
    return commonHandler(req,res,next,officeQuery.v1.query, []);  
};

/*
    commonHandler for all request to get record from DB and sendi ng response 
    @params:    req: request object, 
                res: response object, 
                next: callback method, 
                query: DB to execute, 
                params: Filter params for the query
*/
async function commonHandler(req, res, next, query, params){
    const execParamQuery = require('./mysql').execParamQuery;
    try {
        //get result from db
        let result = await execParamQuery(query, params);  

        //if result present in 
        if(typeof result != "undefined") res.send(200, {data: result});
         //no data found in DB return 400 status code with error
         else res.send(400, {error: "No Data found"}); //ToDo Error Code
         //go to after handler
         return next();
    } catch (error) {
        log.error("master.js, Handlers: commonHandler " + error);
        //error when getting data from mysql DB
        res.send(400, {error: "No Data found"}); //ToDo Error Code
    }
    return next();
}

module.exports = master
const log = require('./logger');

const consult = {};

/*
    handler for get consults of the patient 
    @params: op_number
    version: v1
*/
consult.consultsV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: getConsultV1Handler");
    const consultQuery = require('./sql').consult;
    //if op_number not present
    if(!req.params.op_number) res.send(400, {error: "op number missing"});

    /* commonHandler to get patient consult from db 
        @params:    query: consultQuery.v1.query, 
                    params: [req.params.op_number]
    */
    return commonHandler(req,res,next,consultQuery.v1.query, [req.params.op_number]);
}

/*
    handler for get consultsummary of the patient 
    @params: consult_id
    version: v1
*/
consult.consultsummaryV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: consultsummaryV1Handler");
    const consultsummaryQuery = require('./sql').consultsummary.v1.query;
    //if op_number not present
    if(!req.params.consult_id) res.send(400, {error: "consult_id missing"});

    /* commonHandler to get patient consult from db 
        @params:    query: consultsummaryQuery, 
                    params: [req.params.consult_id]
    */
    return commonHandler(req,res,next,consultsummaryQuery, [req.params.consult_id, req.params.consult_id]);
}

/*
    handler for vital signs of the patient 
    @params: consult_id
    version: v1
*/
consult.vitalSignV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: vitalSignV1Handler");
    const vitalQuery = require('./sql').vitalsign;
    if(!req.params.consult_id) res.send(400, {error: "consult_id missing"});
    /* commonHandler to get insurar from db 
        @params:    query: vitalQuery.v1.query, 
                    params: [req.params.consult_id]
    */
    return commonHandler(req,res,next,vitalQuery.v1.query, [req.params.consult_id]);
}

/*
    handler for lab result of the patient 
    @params: consult_id, office_id
    version: v1
*/
consult.labResultV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: labResultV1Handler");
    const labResultQuery = require('./sql').labresult;
    if(!req.params.consult_id && !req.params.office_id) res.send(400, {error: "consult_id/office_id missing"});

    /* commonHandler to get insurar from db 
        @params:    query: labResultQuery.v1.query, 
                    params: [req.params.consult_id, req.params.office_id]
    */
    return commonHandler(req,res,next,labResultQuery.v1.query, [req.params.consult_id, req.params.office_id]);  
}

/*
    handler for patient profile
    @params: op_number
    version: v1
*/
consult.profileV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: profileV1Handler");
    const myprofileQuery = require('./sql').myprofile;
    if(!req.params.op_number) res.send(400, {error: "op_number missing"});

    /* commonHandler to get insurar from db 
        @params:    query: labResultQuery.v1.query, 
                    params: [req.params.op_number, req.params.op_number] *two times need to pass
    */
    return commonHandler(req,res,next,myprofileQuery.v1.query, [req.params.op_number, req.params.op_number]);  
}

/*
    handler for bookAppointment
    @params: op_number, doctors_id
    version: v1
*/
consult.bookAppointmentV1Handler = async function(req,res,next) {
    log.debug("consult.js, Handlers: bookAppointmentV1Handler");
    const execParamQuery = require('./mysql').execParamQuery;
    if(!req.params.op_number) {res.send(400, {error: "op_number missing"});return next();}
    if(!req.params.doctors_id) {res.send(400, {error: "doctors_id missing"});return next();}
    let doctorProfile, patientProfile;
    try {
        //doctor v3 query
        log.debug("consult.js, Handlers: bookAppointmentV1Handler, getting doctor profile");
        const doctorsQuery = require('./sql').doctors.v3.query;
        doctorProfile = await execParamQuery(doctorsQuery, [req.params.doctors_id]);
        
        //patient v1 query
        log.debug("consult.js, Handlers: bookAppointmentV1Handler, getting patient profile");
        const myprofileQuery = require('./sql').myprofile.v1.query;
        patientProfile = await execParamQuery(myprofileQuery, [req.params.op_number, req.params.op_number]);

        if(!patientProfile.length) {
            log.error("consult.js, Handlers: bookAppointmentV1Handler: No patient data found for:" + req.params.op_number);
            res.send(400, {error: "no patient data found"});
            return next();
        }

        // mail subject
        const subject = "Appointment request from " + patientProfile[0].patient_name;
        //mail body
        const body = `
            <h3>Dear Manager,</h3>
            <p>There is an appointment request from the following patient:</p>
            <p>Name:&nbsp; ${patientProfile[0].patient_name}</p>
            <p>Mobile:&nbsp; ${patientProfile[0].mobile}</p>
            <p>Email:&nbsp; ${(patientProfile[0].email) ? patientProfile[0].email : '-'}</p>
            <p>MRN:&nbsp; ${patientProfile[0].op_number}</p>
            <p>Doctor:&nbsp; ${doctorProfile[0].doctors_name}</p>
            <blockquote>
                <p><em>This request is generated from the mobile app user</em></p>
            </blockquote>`;
        const mail = require('./mail').sendMail;
        mail(null,subject,body);
        res.send(200, {data: "We will connect you for confirmation."});
        return next();

    } catch (error) {
        log.error("consult.js, Handlers: bookAppointmentV1Handler: " + error);
        res.send(400, {error: "Something went wrong. Please call clinic"});
        return next();
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
async function commonHandler(req, res, next, query, params){
    const execParamQuery = require('./mysql').execParamQuery;

    try {
        //get result from db
        let result = await execParamQuery(query, params);  

        //if no result from execParamQuery
        if(typeof result != "undefined") res.send(200, {data: result});
        //no data found in DB return 400 status code with error
        else res.send(400, {error: "No Data found"}); //ToDo Error Code
        //go to after handler
        return next();
    } catch (error) {
        log.error("consult.js, Handlers: commonHandler " + error);
        //error while getting data from mysql DB
        res.send(400, {error: "No Data found"}); //ToDo Error Code
    }
    return next();
}

module.exports = consult;
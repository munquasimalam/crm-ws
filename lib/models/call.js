const mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp')
log = require('../logger');

let call = {};

const CallSchema = new mongoose.Schema({
    message: {
        type: String,
        trim: true
    },
    createdBy: {
        id: {
            type: Number,
            trim: true
        },
        name: {
            type: String,
            trim: true
        }
    },
    mobile:[],
    customerInfo: {
        name: {
            type: String,
            trim: true
        },
        gender:{
            type: String,
            trim: true
        },
        nationality:{
            type: String,
            trim: true
        }
    },
    // facebook,advertigement,net
    source:{
        type: String,
        trim: true
    },
    // customer_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Customer'
    // },
    callType: {
        type:String,
        enum: ["Inbound", "Outbound"]
    },
    //date of followUp
    followupDate: {
        type: String,
        trim: true
    },
    //Open, Closed
    status: {
        type: String,
        enum: ["Open", "Close"],
        trim: true
    },
    
    //Reminder, Normal
    alertType: {
        type: String,
        trim: true
    }
});

// adding timstamps before creating record
CallSchema.plugin(timestamps)

//Mongoos Call model
const Call = mongoose.model('Call', CallSchema);

/*
    createCall create new call in the DB 
    @params:    callObj: contains call details.              
*/
call.createCall = function (callObj) {
    log.info("call model createCall")
    let callObject = new Call(callObj);
    return new Promise((resolve, reject) => {
        callObject.save((err, result) => {
            log.debug(result)
            if (err) {
                if (err._message) {
                    log.error(err);
                    return reject(err._message);
                }
                return reject(err);
            }
            return resolve(result.toObject());
        });
    });
};


/*
**
 *  findOneCall find one call by call id from  DB 
 * @param {*} condition 
 * @param {*} projections 
 */
call.findOneCall = function (condition, projections) {
    log.info("call model findOneCall")
    return new Promise((resolve, reject) => {
        Call.findOne(condition, projections, (err, result) => {
            log.debug(result)
            if (err) return reject(err);
            return resolve(result.toObject());
        });
    });
}

/*
    updateCall update an existing note.  
    @params:    callObj: contains call details.             
*/
call.updateCall = function (id, callObj) {
    log.info("call model updateCall");
    return new Promise((resolve, reject) => {
        if (!id) return reject("Id not found");
        //find and update object by id
        Call.update({ _id: id }, callObj, (err, result) => {
            log.debug(result)
            if (err) return reject(err);
            return resolve(result);
        });
    });

}

/*
    searchCall   existing notes.  
    @params:    condition: contains Filters. 
    @params:    projection: decide no fields to select.            
*/
call.searchCall = function (condition, projection) {
    log.info("call.js model searchCall")
    log.debug(condition)
    return new Promise((resolve, reject) => {
        Call.find(condition, projection, (err, result) => {
            log.debug(result)
            if (err) return reject(err);
            return resolve(result);
        });
    });
}


module.exports = call;
const mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp')
    log = require('../logger');
    let remainder = {};
 
const RemainderSchema = new mongoose.Schema({
    // Remainder date
    date: {
        type: String,
        trim: true
    },
    //remainder type payment ,Treatment,File open ,other
    type:{
        type: String,
        enum: ["Payment", "Treatment","FileOpen","Other"]
    },
    status:{
        type: String,
        enum: ["Open", "Close"],
        default:"Open"

    },
    
    message: {
        type:String,
        trim:true
    },
    //  customerId: {
    //      type: mongoose.Schema.Types.ObjectId,
    //      ref: 'Customer'
    //  },
    patient: {
        opNo: {
            type: String,
            trim: true
        },
        name: {
            type: String,
            trim: true
        },
        consultId: {
            type: String,
            trim: true
        }
    },
     // Remainder Created by 
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
    //priviledge to view the remark ALL, CALLER, RECEPTIONIST
    priviledge: []
});

// adding timstamps before creating record
RemainderSchema.plugin(timestamps)

//Mongoos Remainder model
const Remainder = mongoose.model('Remainder', RemainderSchema);

/*
    createRemainder create new remainder in the DB 
    @params:    obj: contains remainder details.              
*/
remainder.createRemainder = function (obj) {
    log.info("remainder model createRemainder")
    let Object = new Remainder(obj);
    return new Promise((resolve, reject) => {
        Object.save((err, result) => {
             if (err) {
                if (err._message) {
                    log.error(err);
                    return reject(err._message);
                }
                return reject(err);
            }
            return resolve(result);
        });
    });
};

/*
**
 *  findOneRemainder find one remainder by remainder id from  DB 
 * @param {*} condition 
 * @param {*} projections 
 */
remainder.findOneRemainder = function (condition, projections) {
    log.info("remainder model findOneRemainder")
    return new Promise((resolve, reject) => {
        Remainder.findOne(condition, projections, (err, result) => {
              if (err) return reject(err);
            return resolve(result);
        });
    });
}

/*
    updateRemainder update an existing remainder.  
    @params:    obj: contains remainder details.             
*/
remainder.updateRemainder = function (id, obj) {
    log.info("remainder model updateRemainder");
    return new Promise((resolve, reject) => {
        if (!id) return reject("Id not found");
        //find and update object by id
        Remainder.update({ _id: id }, obj, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

/*
    searchRemainder   existing remainders.  
    @params:    condition: contains Filters. 
    @params:    projection: decide no of fields to select.            
*/
remainder.searchRemainder = function (condition, projection) {
    log.info("remainder.js model searchRemainder")
    return new Promise((resolve, reject) => {
        Remainder.find(condition, projection, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

/*
    countRemainder   existing remainders.  
    @params:    condition: contains Filters. 
    @params:    projection: decide no of fields to select.            
*/
remainder.countRemainder = function (condition) {
    log.info("remainder.js model countRemainder")
    return new Promise((resolve, reject) => {
        Remainder.countDocuments(condition, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

module.exports = remainder;
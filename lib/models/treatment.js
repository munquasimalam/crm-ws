const mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp')
log = require('../logger');

let treatments = {};

const TreatmentSchema = new mongoose.Schema({
  
    serviceDate: {
        type: String,
        trim: true

    },
    services:[],

    // status of treatment 
    status: {
        type:String,
        enum: ["Open", "Close"],
        default:"Open"
    },
    performedBy: {
        id: {
            type: Number,
            trim: true
        },
        name: {
            type: String,
            trim: true
        }
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
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
   
    consultationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultation'
    },
   
});

// adding timstamps before creating record
TreatmentSchema.plugin(timestamps)


//Mongoos Treatment model
const Treatment = mongoose.model('Treatment', TreatmentSchema);

/*
    createTreatment create new treatment in the DB 
    @params:    obj: contains treatment details.              
*/
treatments.createTreatment = function (obj) {
    log.info("treatment model createTreatment")
    let treatObj = new Treatment(obj);
    return new Promise((resolve, reject) => {
        treatObj.save((err, result) => {
            if (err) {
                if (err._message) {
                    log.error(err)
                    return reject(err);
                }
                return reject(err);
            }
            return resolve(result);
        });
    });
};


/**
 *  findOneTreatment  get one treatment by id from  DB 
 * @param {*} condition 
 * @param {*} projections 
 */
treatments.findOneTreatment = function (condition, projections) {
    log.info("treatment model findOneTreatment")
    return new Promise((resolve, reject) => {
        Treatment.findOne(condition, projections, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}
/*
    updateTreatment update an existing Treatment.  
    @params:    customerObj: contains custmer details.             
*/
treatments.updateTreatment = function (id, obj) {
    log.info("treatment model updateTreatment");
    return new Promise((resolve, reject) => {
        if (!id) return reject("Id not found");
        //find and update object by id
        Treatment.update({ _id: id }, obj, (err, result) => {
            log.debug(result)
            if (err) return reject(err);
            return resolve(result);
        });
    });

}

/*
    searchTreatment search  Treatments.  
    @params:    condition: filters.
    @params:    projection: no of fields.             
*/
treatments.searchTreatment = function (condition, projection) {
    log.info("treatment.js model searchTreatment")
    return new Promise((resolve, reject) => {
             Treatment.find(condition, projection, (err, result) => {
            log.debug(result)
            if (err) return reject(err);
            return resolve(result);
        });
    });
}



module.exports = treatments;
const mongoose = require('mongoose');
const moment = require('moment');
    timestamps = require('mongoose-timestamp')
    log = require('../logger');
    let remark = {};
 
const RemarkSchema = new mongoose.Schema({
    // Name of the table from the remark is created
    collectionName: {
        type: String,
        trim: true
    },
    //Row ID of the collection (call id) from where it is created.
    documentId:{
        type: String,
        trim: true
    },
    //Created by Remark
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
    priviledge: [],
    // note or remark Text
    remark: {
        type:String,
        trim:true
    },
     customerId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Customer'
     },
     // remark create date
     createDate: {
        type:String,
        trim:true
    }
});

// adding timstamps before creating record
RemarkSchema.plugin(timestamps)

//Mongoos user model
const Remark = mongoose.model('Remark', RemarkSchema);

/*
    createRemark create new remark in the DB 
    @params:    callObj: contains call details.              
*/
remark.createRemark = function (obj) {
    log.info("remark model createRemark")
    obj.createDate = moment().format("DD-MM-YYYY");
    let Object = new Remark(obj);
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
 *  findOneRemark find one remark by call id from  DB 
 * @param {*} condition 
 * @param {*} projections 
 */
remark.findOneRemark = function (condition, projections) {
    log.info("remark model findOneRemark")
    return new Promise((resolve, reject) => {
        Remark.findOne(condition, projections, (err, result) => {
             if (err) return reject(err);
            return resolve(result);
        });
    });
}

/*
    updateRemark update an existing note.  
    @params:    callObj: contains call details.             
*/
remark.updateRemark = function (id, obj) {
    log.info("Remark model updateRemark");
    return new Promise((resolve, reject) => {
        if (!id) return reject("Id not found");
        //find and update object by id
        Remark.update({ documentId: id }, obj, (err, result) => {
               if (err) return reject(err);
            return resolve(result);
        });
    });
}

/*
    searchRemark   existing notes.  
    @params:    condition: contains Filters. 
    @params:    projection: decide no fields to select.            
*/
remark.searchRemark = function (condition, projection) {
    log.info("remark.js model searchRemark")
    return new Promise((resolve, reject) => {
        Remark.find(condition, projection, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

module.exports = remark;
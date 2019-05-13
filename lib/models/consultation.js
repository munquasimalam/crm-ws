const mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp')
log = require('../logger');

let consultations = {};

const ConsultationSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
 // consultation date
    date: {
        type: String,
        trim: true

    },
    time: {
        type: Number,
        trim: true

    },
    payment: {
        // cash,cheque,card
        type: {
            type: String,
            trim: true

        },
        total: {
            type: Number,
            trim: true

        },
        // default ZERO if emi ZERO then full payment else partial
        emis: {
            type: Number,
            trim: true,
            default: 0
            // required: true
        },
        comment: {
            type: String,
            trim: true

        },
        //Open, Closed When Full payment Status Close
        status: {
            type: String,
            enum: ["Open", "Close"],
            trim: true,
            default: "Open"
        }
    },
    installments: [{
        mode: {
            type: String,
            enum: ["Cash", "Cheque", "Card"],
            trim: true

        },
        // installment
        date: {
            type: String,
            trim: true

        },
        amount: {
            type: String,
            trim: true

        },
        comment: {
            type: String,
            trim: true

        },
        // cash/card/cheque
        type: {
            type: String,
            trim: true

        }
    }],
    medicalsummary: [{
        // label blood sample
        label: {
            type: String,
            trim: true

        },
        //    value true if collected
        value: {
            type: String,
            trim: true

        },
        note: {
            type: String,
            trim: true

        },
        // sample collection date
        date: {
            type: String,
            trim: true

        }
    }],
    hairType: {
        type: String,
        trim: true
    },
    implantType: {
        type: String,
        trim: true
    },
    noOfHair: {
        type: String,
        trim: true
    },
    remark: {
        type: String,
        trim: true
    },
    implantArea: {
        type: String,
        trim: true
    },
    prp: {
        type: String,
        trim: true
    },
    bloodTest: {
        type: String,
        trim: true
    },
   
    rhinoplasty: {
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
    }
    

});

// adding timstamps before creating record
ConsultationSchema.plugin(timestamps)

//pre handler
ConsultationSchema.pre("findOne", function (next) {
    this.populate("customerId");
    next();
})

//Mongoos consultations model
const Consultation = mongoose.model('Consultation', ConsultationSchema);

/*
    createConsultation create new Consultation in the DB 
    @params:    consultationObj: contains customer/patient details.              
*/
consultations.createConsultation = function (consultationObj) {
    log.info("consultation model createConsultation")
    let consultation = new Consultation(consultationObj);
    return new Promise((resolve, reject) => {
        consultation.save((err, result) => {
            if (err) {
                if (err._message) {
                    log.error(err._message)
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
 *  findOneConsultation find one consultation by consult id from  DB 
 * @param {*} condition 
 * @param {*} projections 
 */
consultations.findOneConsultation = function (condition, projections) {
    log.info("consultation model findOneConsultation")
    return new Promise((resolve, reject) => {
        // Users.findOne({username,password},{},(err,result)=>{
        Consultation.findOne(condition, projections, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

/*
    updateConsultation update an existing consultation.  
    @params:    consultationObj: contains consultation details.             
*/
consultations.updateConsultation = function (consultationId, consultationObj) {
    log.info("consultation model updateConsultation");
    return new Promise((resolve, reject) => {
        if (!consultationId) return reject("Id not found");
         //find and update object by id
        Consultation.update({ _id: consultationId }, consultationObj, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });

}

/*
    searchConsultation update an existing consultation.  
    @params:    consultationObj: contains consultation details.             
*/
consultations.searchConsultation = function (condition, projection) {
    log.info("consultation.js model searchConsultation")
    return new Promise((resolve, reject) => {
        Consultation.find(condition, projection, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
            // });
        }).populate([{ path: 'customerId', select: 'demography.opNo demography.fullName  demography.residenceId  demography.nationality contact.mobile' }]);
    });
}



module.exports = consultations;
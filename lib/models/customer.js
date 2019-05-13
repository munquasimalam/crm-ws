const mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp')
log = require('../logger');

let customers = {};

const CustomerSchema = new mongoose.Schema({
    consultationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultation'
    },
    demography: {
        fullName: {
            type: String,
            trim: true,
            required: true
        },
        gender: {
            type: String,
            trim: true,
            required: true
        },
        dob: {
            type: String,
            trim: true
            //  required: true,
        },
        meritalStatus: {
            type: String,
            trim: true,
            //  required: true,
        },
        opNo: {
            type: String,
            trim: true

        },
        residenceId: {
            type: String,
            trim: true

        },
        nationality: {
            type: String,
            trim: true

        },
        otherId: {
            type: String,
            trim: true

        },
        otherIdName: {
            type: String,
            trim: true

        }
    },
    contact: {
        mobile: [{
            type: Number,
            required: true
        }],
        email: {
            type: String,
            trim: true,

        },
        address: {
            type: String,
            trim: true

        },
        city: {
            type: String,
            trim: true

        }

    },
    coordinator: {
        id: {
            type: Number,
            trim: true
        },
        name: {
            type: String,
            trim: true
        }
    },
    openFile: {
        type: Boolean,
        trim: true
    },
    source: {
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
    officeId: {
        type: Number,
        trim: true
    },
    // To show the stage of customer 
    stage: {
        type:String,
        enum: ["Partial Payment", "Full Payment","Blood Sample"]
    },

});

// adding timstamps before creating record
CustomerSchema.plugin(timestamps)

// opNo validate

CustomerSchema.path('demography.opNo').validate(async (value) => {
    const unCount = await Customer.count({ "demography.opNo": value });
    log.debug("unCount", unCount)
    return !unCount;
}, 'OP No already exists');

//Mongoos user model
const Customer = mongoose.model('Customer', CustomerSchema);

/*
    createCustomer create new Customer in the DB 
    @params:    customerObj: contains customer/patient details.              
*/
customers.createCustomer = function (customerObj) {
    log.info("customers model createCustomer")
    let customer = new Customer(customerObj);
    return new Promise((resolve, reject) => {
        customer.save((err, result) => {
            log.debug(result)
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
 *  findOneCustomer one customer by id from  DB 
 * @param {*} condition 
 * @param {*} projections 
 */
customers.findOneCustomer = function (condition, projections) {
    log.info("customer model findOneCustomer")
    return new Promise((resolve, reject) => {
        Customer.findOne(condition, projections, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}
/*
    updateCustomer update an existing customer/patient.  
    @params:    customerObj: contains custmer details.             
*/
customers.updateCustomer = function (id, customerObj) {
    log.info("customer model updateCustomer");
    return new Promise((resolve, reject) => {
        if (!id) return reject("Id not found");
        //find and update object by id
         Customer.update({ _id: id }, customerObj, (err, result) => {
            log.debug(result)
            if (err) return reject(err);
            return resolve(result);
        });
    });

}
customers.searchCustomer = function (condition, projection) {
    log.info("customer.js model searchCustomer")
    return new Promise((resolve, reject) => {
        //Customer.find(condition, projection, (err, result) => {
        Customer.find(condition, projection, (err, result) => {
            log.debug(result)
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

/*
    countCustomer   existing customer Or lead.  
    @params:    condition: contains Filters. 
    @params:    projection: decide no of fields to select.            
*/
customers.countCustomer = function (condition) {
    log.info("customer.js model countCustomer")
    return new Promise((resolve, reject) => {
        Customer.countDocuments(condition, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

module.exports = customers;
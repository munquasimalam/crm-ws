const mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp')
log = require('../logger');

let user = {};

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    activeDate: {
        type: Date
    },
    activeStatus: {
        type: Boolean,
        trim: true,
        required: true,
        default: true
    },
    userLabel: {
        type: String,
        trim: true,
        required: true,
    },
    
    userType: {
        type: String,
        trim: true,
        required: true,
    },
    office: {
        officeId: {
            type: Number,
            trim: true,
            required: false,
        },
        officeName: {
            type: String,
            trim: true,
            required: false,
        }

    }
});

// adding timstamps before creating record
UserSchema.plugin(timestamps)

// userName validate
UserSchema.path('userName').validate(async (value) => {
    const unCount = await User.count({ userName: value });
    log.debug("unCount", unCount)
    return !unCount;
}, 'User Name already exists');

//Mongoos user model
const User = mongoose.model('User', UserSchema);

/*
    createUser create new user in the DB 
    @params:    userObj: contains user details.              
*/
user.createUser = function (userObj) {
    log.info("user model createUser")
    let user = new User(userObj);
    return new Promise((resolve, reject) => {
        user.save((err, result) => {
            log.debug(result)
            if (err) {
                if (err._message) return reject(err._message);
                return reject(err);
            }
            return resolve(result.toObject());
        });
    });
};

/**
 *  findOneUser one user by id from  DB 
 * @param {*} condition 
 * @param {*} projections 
 */
user.findOneUser = function (condition, projections) {
    log.info("user model findOne")
    return new Promise((resolve, reject) => {
        // Users.findOne({username,password},{},(err,result)=>{
        User.findOne(condition, projections, (err, result) => {
            log.debug(result)
            if (err) return reject(err);
            return resolve(result.toObject());
        });
    });
}

/*
    updateUser update an existing user.  
    @params:    userObj: contains user details.             
*/
user.updateUser = function (id, userObj) {
    log.info("user model updateUser")
    return new Promise((resolve, reject) => {
        if (!id) return reject("Id not found");
        //find and update object by id
        User.update({ _id: id }, userObj, (err, result) => {
            log.debug(result)
            if (err) return reject(err);
            return resolve(result);
        });
    });
}



/**
 * searchUser users by conditins.
 * @param {*} conditions 
 * @param {*} projections 
 */
user.searchUser = function (condition, projection) {
    log.info("user model searchUser")
    return new Promise((resolve, reject) => {
        User.find(condition, projection, (err, result) => {
            log.debug(result)
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

module.exports = user;
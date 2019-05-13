var nodemailer = require('nodemailer');
var mailConfig = require('../config/config').mail;
const log = require('./logger');

let mail = {};

/*
    function to Send mail
    @params: 
        toMails: xyz@abc.com,123@abc.com
        subject: mail subject
        body: mail body

*/
mail.sendMail = function(toMails,subject,body){
    // toMails = "talatm02@gmail.com";
    // subject = "TEST";
    // body = "TEST BODY";
    if(!toMails) toMails = mailConfig.to;
    const mailOptions = {
        from:mailConfig.from, // sender address
        to:toMails, // list of receivers
        subject: subject, // Subject line
        html:body
    }; 
    
    const transporter = nodemailer.createTransport({
        host: mailConfig.host,
        port: mailConfig.port,
        secure: false,
        tls: {
            rejectUnauthorized:false
        },
        auth: {
            user: mailConfig.username, // sender address
            pass: mailConfig.pass
        }
    });
    transporter.sendMail(mailOptions, (err, result) => {
        if (err) return log.error("mail.js, Handlers: sendMail " + err);
        return log.debug("sent mail successfully: " + toMails);
    });
}

module.exports = mail;
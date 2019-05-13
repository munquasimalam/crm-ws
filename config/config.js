module.exports = {
    name: "patientAPI",
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3003,
    loglevel: "all", //debug, info, error, all , off
    showconsole: true, //true,false
    db:{
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password : process.env.DB_PSW || 'medteam2013',
        port : process.env.DB_PORT || 3306, //port mysql
        database:process.env.DB_NAME || 'eclinic_new'
    },

   // mongoUrl: process.env.MONGOURL || "mongodb://medas:medteam2013@ds119606.mlab.com:19606/medas-crm",
    mongoUrl: "mongodb://localhost:27017/crm",
    
    mail: {
        name: "mailAPI",
        from: process.env.FROM || "talat@medassolutions.com",// from address
        to: process.env.To || "talatm02@gmail.com",// to address
        host : process.env.HOST || "smtp.emailsrvr.com",
        emailPort : process.env.EMAILPORT || 2525,
        username : process.env.USERNAME || "talat@medassolutions.com", 
        pass : process.env.PSW || 'Med@$pass1',
    }
}
const server = require('./lib/server');
const mysql = require('./lib/mysql');
const mongo = require('./lib/mongo');

//init
const app = {}

//init defination
app.init = function(){
    //GLOBAL DB Object
    _mysqldb = mysql.init();
    _mongodb = mongo.init();
    server.init();
}

app.init();
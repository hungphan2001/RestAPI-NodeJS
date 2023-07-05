const mysql = require('mysql');

var connection = mysql.createConnection({
    host:'localhost',
    database:'testing',
    user:'root',
    password:''
})

connection.connect((error)=>{
    if(error){
        throw error;
    }else{
        console.log('MySQL connected');
    }
})

module.exports=connection;
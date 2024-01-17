const mysql = require('mysql')
let connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'vallabhnagar',
    multipleStatements:true
})

connection.connect((err)=>{
    if(err)
    {
        console.log(err)
    }
    else
    {
        console.log('Connection Establish')
    }
})

module.exports = connection
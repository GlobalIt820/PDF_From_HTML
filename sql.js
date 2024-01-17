const mysql = require('mysql')
let connection = mysql.createConnection({
    host:'http://103.189.88.81:888/phpmyadmin_917d8151be74e484/sql.php',
    user:'hbmvhs_sql',
    password:'hbmvhs_sql@321',
    database:'hbmvhs_sql',
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
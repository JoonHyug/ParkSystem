var mysql = require('mysql');
var connection = mysql.createConnection({
	host :'localhost',
	user : 'abc',
	password : '111111',
	database : 'park_db'
});

connection.connect();

connection.query('SELECT 1+1 AS solution', function(error, results, fields){
	if (error) throw error;
    console.log(results);
	console.log('The solution is : ', results[0].solution);
});

connection.end();
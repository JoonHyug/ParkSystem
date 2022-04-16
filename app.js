var express = require('express');
var http = require('http');
var path = require('path');
var bodyParaser = require('body-parser');

var app = express();


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

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParaser.urlencoded({extended: true}));

app.get('/process/login', function(req, res) {	
	var paramId = req.param('id');
	
	console.log('/precess/login 처리, id: '+ paramId);

	res.write("Success");
	res.end();
});

http.createServer(app).listen(3000, function() {
	console.log('Express 서버가 3000번 포트에서 시작됨.');
});
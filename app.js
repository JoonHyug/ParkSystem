const express = require('express');
const http = require('http');
const url = require('url');
const path = require('path');
const bodyParaser = require('body-parser');
const ejs = require('ejs');
//DB 세팅
const mysql = require('mysql');
const dbconfig = require('./dbconfig.js');
const connection = mysql.createConnection(dbconfig);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParaser.urlencoded({extended: true}));


app.get('/login', function(req, res) {	
	let paramId = req.param('id');

	console.log('/login 처리, id: '+ paramId);

	res.write(paramId);
	res.write("\nSuccess");
	res.end();
});

app.get('/', function(req, res){
	res.write('Welcom!');
	res.end();
});

app.get('/testDB', function(req, res){
	connection.query('SELECT * FROM test', (error, rows) =>{
		console.log(rows);
		res.send(rows);
		res.end();
	});
});

app.get('/htmltest', function(req, res){
	let page;
	ejs.renderFile('./contents/login.html', (err, str) => {
		page = str;
	});
	res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
        res.end(page);
});

app.get('/AreaA', function(req, res){
	let page;
	ejs.renderFile('./contents/AreaA.html', (err, str) => {
		page = str;
	});
	res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
    res.end(page);
});

app.get('/main', function(req, res){
	let page;
	ejs.renderFile('./contents/main.html', (err, str) => {
		page = str;
	});
	res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
    res.end(page);
});

app.get('/inDB', function(req, res){
	let paramId = req.param('data');

	connection.query('INSERT INTO test(test1) VALUES('+data+');', (error, rows) =>{
		console.log(rows);
		res.send(rows);
	});

	console.log('/inDB 처리, id: '+ paramId);

	res.write(paramId);
	res.write("\nSuccess");
	res.end();
});

/* const server = http.createServer(function(req, res){
	const _url = req.url;
	const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

	switch(pathname){
		case '/' :
			res.write('Welcom!');
			res.end();
			break;
		case '/testDB' :
			connection.query('SELECT * FROM test', (error, rows) =>{
				console.log(rows);
				res.send(rows); //에러남
			});
			break;
	}
}); */

/* server.listen((3000), function(){
	console.log('Express 1서버가 3000번 포트에서 시작됨.');
}); */

http.createServer(app).listen(3000, function() {
	console.log('Express 서버가 3000번 포트에서 시작됨.');
});

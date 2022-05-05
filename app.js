const express = require('express');
const http = require('http');
const url = require('url');
const path = require('path');
const bodyParaser = require('body-parser');
const fs = require('fs');
const ejs = require('ejs');

//DB 세팅
const mysql = require('mysql');
const dbconfig = require('./dbconfig.js');
const connection = mysql.createConnection(dbconfig);

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
//app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(bodyParaser.urlencoded({extended: true}));




app.get('/login', function(req, res) {	
	let paramId = req.param('id');

	console.log('/login 처리, id: '+ paramId);

	res.write(paramId);
	res.write("\nSuccess");
	res.end();
});

// app.get('/', function(req, res){
// 	res.write('Welcom!');
// 	rse.end();
// });

app.get('/testDB', function(req, res){
	connection.query('SELECT * FROM test', (error, rows) =>{
		console.log(rows);
		res.send(rows);
		res.end();
	});
});

// app.get('/htmltest', function(req, res){
// 	let page;
// 	ejs.renderFile('./contents/login.html', (err, str) => {
// 		page = str;
// 	});
// 	res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
//         res.end(page);
// });

let temp = "A";
app.get('/Area'+temp, function(req, res){
	fs.readFile('./contents/AreaA.ejs','utf8', function (err, data) {
		connection.query('select * from park_isparking', function (err, results) {
		  if (err) {
			res.send(err)
		  } else {
			res.send(ejs.render(data, {
			  data: results
			}))
		  }
		})
	  })
});

app.get('/AreaADB', function(req, res){
	fs.readFile('./contents/AreaADBmanage.ejs','utf8', function (err, data) {
		connection.query('select * FROM PARK_isParking', function (err, results) {
		  if (err) {
			res.send(err)
		  } else {
			res.send(ejs.render(data, {
			  data: results
			}))
		  }
		})
	  })
});

app.get('/AreaB', function(req, res){
	let page;
	ejs.renderFile('./contents/AreaB.html', (err, str) => {
		page = str;
	});
	res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
    res.end(page);
});

app.get('/AreaC', function(req, res){
	let page;
	ejs.renderFile('./contents/AreaC.html', (err, str) => {
		page = str;
	});
	res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
    res.end(page);
});

app.get('/AreaD', function(req, res){
	let page;
	ejs.renderFile('./contents/AreaD.html', (err, str) => {
		page = str;
	});
	res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
    res.end(page);
});

app.get('/DBmanage', function(req, res){
	// let page;
	// ejs.renderFile('./contents/DBmanage.ejs', {
	// 	hehe: "ss",
	// 	data:[
	// 		{
	// 			id:1,
	// 			name:"hayoon",
	// 			artist:"no",
	// 			genre:"pop"
	// 		},
	// 		{
	// 			id:2,
	// 			name:"boo",
	// 			artist:"sss",
	// 			genre:"hippop"
	// 		},

	// 	]}, 'utf8', function (err, data) {
	// 		page = data;
	fs.readFile('./contents/DBmanage.ejs','utf8', function (err, data) {
		connection.query('select * from test', function (err, results) {
		  if (err) {
			res.send(err)
		  } else {
			res.send(ejs.render(data, {
			  data: results
			}))
		  }
		})
	  })
});

app.get('/', function(req, res){
	let page;
	ejs.renderFile('./contents/main.html', (err, str) => {
		page = str;
	});
	res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
    res.end(page);
});

// CREATE TABLE test(
// id int NOT NULL PRIMARY KEY,
// test1 int NOT NULL,
// test2 VARCHAR(50));
app.post('/inDB', function(req, res){
	const body = req.body;	//app.use(express.json());사용 안한거, 아두이노에서 json파일 크기가 너무 작아서 body를 읽기 전에 클라이언트가 중단되어서 오류가 생겼었음
	console.log(body);
	//connection.query('INSERT INTO test(id, test1, test2) VALUES(?, ?, ?);',[
	connection.query('UPDATE test SET test1=?, test2=? WHERE id=?;',[	 
		body.test1, 
		body.test2,
		body.id
	]);//같은 id값이라서 중복해서 삽입 할 경우 에러남
});

app.get('/delete/:id', function(req, res){
	connection.query('DELETE FROM test WHERE id=?;', [req.params.id], function(){
		res.redirect('/DBmanage');
	})
});

app.get('/insert', function(req, res){
	fs.readFile('./contents/insert.html', 'utf-8', function(err, data){
		res.send(data);
	})
});
app.post('/insert', function(req, res){
	const body = req.body;
	connection.query('INSERT INTO test(id, test1, test2) VALUES(?, ?, ?);', [
		body.id,
		body.test1,
		body.test2
	  ], function() {
	res.redirect('/DBmanage')
	})
});
app.get('/edit/:id', function(req, res){
	fs.readFile('./contents/edit.ejs', 'utf-8', function(err, data){
		connection.query('SELECT * FROM test WHERE id=?;', [req.params.id], function(err, result){
			res.send(ejs.render(data, {
				data : result[0]
			}))
		})
	})
});
app.post('/edit/:id', function(req, res){
	const body = req.body;

	connection.query('UPDATE test SET test1=?, test2=? WHERE id=?', [
		body.test1, 
		body.test2, 
		req.params.id], 
		function(){
		res.redirect('/DBmanage')
	})
})
//--------------------------------------추후 간소화 시켜야함-----------------------
app.get('/deleteA/:id', function(req, res){
	connection.query('DELETE FROM park_isparking WHERE id=?;', [req.params.id], function(){
		res.redirect('/AreaADB');
	})
});

app.get('/insertA', function(req, res){
	fs.readFile('./contents/insertA.html', 'utf-8', function(err, data){
		res.send(data);
	})
});
app.post('/insertA', function(req, res){
	const body = req.body;
	connection.query('INSERT INTO park_isparking(id, state) VALUES(?, ?);', [
		body.id,
		Boolean(body.state)
	  ], function() {
	res.redirect('/AreaADB')
	})
});
app.get('/editA/:id', function(req, res){
	fs.readFile('./contents/editA.ejs', 'utf-8', function(err, data){
		connection.query('SELECT * FROM park_isparking WHERE id=?;', [req.params.id], function(err, result){
			console.log(result);
			res.send(ejs.render(data, {
				data : result[0]
			}))
		})
	})
});
app.post('/editA/:id', function(req, res){
	const body = req.body;
	console.log(body);
	connection.query('UPDATE park_isparking SET state=? WHERE id=?;', [
		Boolean(body.state),
		req.params.id], 
		function(){
		res.redirect('/AreaADB')
	})
})

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

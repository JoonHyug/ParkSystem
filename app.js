const express = require('express');
const http = require('http');
const url = require('url');
const path = require('path');
const bodyParaser = require('body-parser');
const fs = require('fs');
const ejs = require('ejs');
// const static = require('serve-static');

//DB 세팅
const mysql = require('mysql');
const dbconfig = require('./dbconfig.js');
const { platform } = require('os');
const connection = mysql.createConnection(dbconfig);

//log 설정
//로그 테스트
const logPath = './connection.log';
function ensureLogFile(){
	const isExists = fs.existsSync(logPath);
	if( !isExists){
		fs.writeFileSync(logPath, '');
	}
};
function readFromLogFile(){
	ensureLogFile();
	return fs.readFileSync(logPath).toString('utf8');
};
function writeLogFile(remoteAddress){
	const beforeLog = readFromLogFile();
	const now = new Date().toUTCString();
	const newLog = `${now}: ${remoteAddress} Access`;
	fs.writeFileSync(logPath, `${beforeLog}\n${newLog}`);
};

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
//app.use(express.static('views'));
app.use(express.json());
//app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(bodyParaser.urlencoded({extended: true}));



app.get('/', function(req, res){
	let page;
	//console.log(path);
	ejs.renderFile('./views//main.html', (err, str) => {
		page = str;
	});
	res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
    res.end(page);
});


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
	console.log(req.headers.host);
	console.log(req.hea)
	console.log(req.ip);
	console.log(req.route.path);
	console.log(req.route.methods);
	//로그 테스트
	writeLogFile(req.connection.remoteAddress);
	fs.readFile('./views/AreaA.ejs','utf8', function (err, data) {
		connection.query('select * from PARK_isParking', function (err, results) {
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
	fs.readFile('./views/AreaADBmanage.ejs','utf8', function (err, data) {
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
	ejs.renderFile('./views/AreaB.html', (err, str) => {
		page = str;
	});
	res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
    res.end(page);
});

app.get('/AreaC', function(req, res){
	let page;
	ejs.renderFile('./views/AreaC.html', (err, str) => {
		page = str;
	});
	res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
    res.end(page);
});

app.get('/AreaD', function(req, res){
	let page;
	ejs.renderFile('./views/AreaD.html', (err, str) => {
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
	fs.readFile('./views/DBmanage.ejs','utf8', function (err, data) {
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

// CREATE TABLE test(
// id int NOT NULL PRIMARY KEY,
// test1 int NOT NULL,
// test2 VARCHAR(50));
app.post('/inDB', function(req, res){
	const body = req.body;	//app.use(express.json());사용 안한거, 아두이노에서 json파일 크기가 너무 작아서 body를 읽기 전에 클라이언트가 중단되어서 오류가 생겼었음
	console.log(body);
	//connection.query('INSERT INTO test(id, test1, test2) VALUES(?, ?, ?);',[
	connection.query('UPDATE PARK_isParking SET state=? WHERE id=?;',[	 
		body.state,
		body.id
	]);//같은 id값이라서 중복해서 삽입 할 경우 에러남
});

app.get('/delete/:id', function(req, res){
	connection.query('DELETE FROM test WHERE id=?;', [req.params.id], function(){
		res.redirect('/DBmanage');
	})
});

app.get('/insert', function(req, res){
	fs.readFile('./views/insert.html', 'utf-8', function(err, data){
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
	fs.readFile('./views/edit.ejs', 'utf-8', function(err, data){
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
	connection.query('DELETE FROM PARK_isParking WHERE id=?;', [req.params.id], function(){
		res.redirect('/AreaADB');
	})
});

app.get('/insertA', function(req, res){
	fs.readFile('./views/insertA.html', 'utf-8', function(err, data){
		res.send(data);
	})
});
app.post('/insertA', function(req, res){
	const body = req.body;
	connection.query('INSERT INTO PARK_isParking(id, state) VALUES(?, ?);', [
		body.id,
		Boolean(body.state)
	  ], function() {
	res.redirect('/AreaADB')
	})
});
app.get('/editA/:id', function(req, res){
	fs.readFile('./views/editA.ejs', 'utf-8', function(err, data){
		connection.query('SELECT * FROM PARK_isParking WHERE id=?;', [req.params.id], function(err, result){
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
	connection.query('UPDATE PARK_isParking SET state=? WHERE id=?;', [
		Boolean(body.state),
		req.params.id], 
		function(){
		res.redirect('/AreaADB')
	})
})

app.get('/inputData', function(req, res){
	connection.query(`INSERT INTO PARK_isParking(id, state) VALUES
					("A-001", 0),
					("A-002", 0),
					("A-003", 0),
					("A-004", 0),
					("A-005", 0),
					("A-006", 0),
					("A-007", 0),
					("A-008", 0);
					`),
					res.redirect('/');
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

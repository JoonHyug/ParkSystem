const express = require('express');
const http = require('http');
const path = require('path');
const bodyParaser = require('body-parser');

const res = require('express/lib/response');

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

http.createServer(app).listen(3000, function() {
	console.log('Express 서버가 3000번 포트에서 시작됨.');
});

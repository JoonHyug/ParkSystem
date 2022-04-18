const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const ejs = require('ejs');
const { ESRCH } = require('constants');
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./db/account.db', (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log('Connected to the mydb database');
    }
});

const sql = `
CREATE TABLE userDB(id text primary key, pass text, first_name text, second_name text, email text)
`;

function sql1(data) {
    return `
INSERT INTO userDB(id, pass, first_name, second_name, email) VALUES('${data.userId}', '${data.userPassword}', '${data.userFirstName}', '${data.userSecondName}', '${data.userEmail}')
`;
}

function sql2(data) {
    return `
SELECT * FROM userDB WHERE id = '${data.userId}'
`;
}

function sql_compare_id(data) {
    return `
    SELECT * FROM userDB WHERE id= '${data.userId}'
    `;
}
function sql_compare_email(data) {
    return `
    SELECT * FROM userDB WHERE email= '${data.userEmail}'
    `;
}
function sql_check_id_pw(data) {
    return `
    SELECT * FROM userDB WHERE id='${data.userId}'AND pass='${data.userPassword}'
    `;
}

const server = http.createServer(function (req, res) {
    const _url = req.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        res.writeHead(302, { Location: '/login' });
        res.end();
    } else if (pathname === '/login') {
        let page;
        ejs.renderFile('./contents/login.html', (err, str) => {
            page = str;

        });
        res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
        res.end(page);
    } else if (pathname === '/request_login') {
        let href = "/login";
        let chunk = '';
        req.on('data', (data) => { chunk += data; });
        req.on('end', function () {
            let data = querystring.parse(chunk.toString());
            console.log(data);
            db.run(sql_compare_id(data), function (err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        console.log(err.code);
                        console.log('로그인 성공');
                        href = '/main';
                    } else throw err;
                } else {
                    console.log(err); 
                    console.log('로그인 실패');
                    href = "/login";
                }
                res.writeHead(302, { Location: href });
                res.end();
            });
        });

    } else if (pathname === '/register') {
        let page;
        ejs.renderFile('./contents/register.html', (err, str) => {
            page = str;

        });
        res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
        res.end(page);
    } else if (pathname === '/request_register') {
        let href = "/register";
        let chunk = '';
        req.on('data', (data) => { chunk += data; });
        req.on('end', function () {
            let data = querystring.parse(chunk.toString());
            db.run(sql1(data), function (err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        console.log(err.code);
                        console.log('회원가입에서 중복된 값이 입력됨');
                        href = '/register';
                    } else throw err;
                } else {
                    console.log('회원가입 성공');
                    href = "/login";
                }
                res.writeHead(302, { Location: href });
                res.end();
            });
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/html;charset=UTF-8' });
        res.end('Not found');
    }


});

server.listen(8000);
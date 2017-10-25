const express = require('express');
const fs = require("fs");
const proxyServer = require("./app/proxy_server");
const http = require("http");

const router_path = "./app/router/";
const jade_path = "./app/jade"
var app = express();

var host = "211.83.110.4";
var port = 8081;

app.use(express.static('app/static'));
app.set('views', jade_path);
app.set('view engine', 'jade');

for (var jade of fs.readdirSync(jade_path)) {
    ((jade1) => {
        if (jade1.indexOf('.') > 0) {
            var j = jade1.split('.')[0]
            app.get(`/${j}`, function (req, res) {
                // res.sendFile(`${process.cwd()}/app/static/html/${url}.html`);
                res.render(j);
            });
        }
    })(jade)
}

for (var file of fs.readdirSync(router_path)) {
    ((file1) => {
        if (file1.indexOf(".") > 0) {
            var router_module = require(router_path + file1);
            var router = app.route(router_module.path);
            for (var handler in router_module.handlers) {
                router[handler](proxy);
            }
        }
    })(file);
}

app.get('/', function (req, res) {
    res.redirect('/developer');
});

var server = app.listen(8000, function () {
    console.info("server running on :8000");
});

function proxy(req, res) {
    var _req = http.request({
        host: host,
        port: port,
        path: req.url,
        method: req.method,
        headers: req.headers
    }, function (_res) {
        res.writeHead(_res.statusCode, _res.headers)
        _res.pipe(res);
    }).on("error", err => {
        console.error(err);
        res.statusCode = 400;
        res.write("Remote Request Failed");
        res.end();
    });
    req.pipe(_req);
}
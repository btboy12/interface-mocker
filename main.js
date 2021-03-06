const express = require('express');
const cookieParse = require('cookie-parser');
const bodyParser = require("body-parser");
const fs = require("fs");
const proxyServer = require("./app/proxy_server");
const argv = require("argv");

const router_path = "./app/router/";
const jade_path = "./app/jade"

const app = express();
const server = require('http').createServer(app);
require("./app/socketio").create(server);

app.use(express.static('app/static'));
app.use(extractIP);
app.use(cookieParse());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', jade_path);
app.set('view engine', 'jade');

var { options } = argv.option([
    {
        name: "port",
        short: "p",
        type: "int",

    },
    {
        name: "proxy",
        short: "x",
        type: "int"
    }
]).run();

for (var jade of fs.readdirSync(jade_path)) {
    ((jade1) => {
        if (jade1.indexOf('.') > 0) {
            var j = jade1.split('.')[0]
            app.get(`/${j}`, function (req, res) {
                // res.sendFile(`${process.cwd()}/app/static/html/${url}.html`);
                res.render(j);
            });
        }
    })(jade);
}

for (var file of fs.readdirSync(router_path)) {
    ((file1) => {
        if (file1.indexOf(".") > 0) {
            var router_module = require(router_path + file1);
            var router = app.route(router_module.path);
            for (var handler in router_module.handlers) {
                router[handler](router_module.handlers[handler]);
            }
        }
    })(file);
}

app.get('/', function (req, res) {
    res.redirect('/developer');
});

server.listen(options.port || 8000, function () {
    console.info("server running on :8000");
    proxyServer.start(options.proxy || 8081)
});

function extractIP(req, res, next) {
    if (!req.cookies || !req.cookies.ip) {
        res.cookie('ip', req.headers['x-forwarded-for'] ||
            req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || '');
    }
    next();
}
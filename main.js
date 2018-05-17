const express = require('express');
const cookieParse = require('cookie-parser');
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session");
const { randChars } = require("./app/utils");

const { promisify } = require("util");

const proxyServer = require("./app/proxy_server");
const argv = require("yargs").default("port", 8000).default("proxy", 8081).argv;

const router_path = "./app/router/";
const jade_path = "./app/jade"

const app = express();
const server = require('http').createServer(app);
require("./app/socketio").create(server);

app.use(express.static('app/static'));
// app.use(extractIP);

const secret = randChars(16);
app.use(session({
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(cookieParse());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', jade_path);
app.set('view engine', 'jade');

const readdir = promisify(fs.readdir);

(async () => {
    let files = await readdir(jade_path);
    files.map(value => {
        if (value.indexOf('.') > 0) {
            var f_name = value.split('.')[0]
            app.get(`/${f_name}`, (req, res) => { res.render(f_name) });
        }
    });
})();

(async () => {
    let files = await readdir(router_path);
    files.map(value => {
        if (value.indexOf(".") > 0) {
            var router_module = require(router_path + value);
            var router = app.route(router_module.path);
            for (var handler in router_module.handlers) {
                router[handler](router_module.handlers[handler]);
            }
        }
    })
})();

app.get('/', function (req, res) {
    res.redirect('/developer');
});

server.listen(argv.port, function () {
    console.info(`server running on:${argv.port}`);
    proxyServer.start(argv.proxy)
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

const http = require('http');
const pathToRegexp = require('path-to-regexp');
const events = require('events');
const socketio = require("./socketio");
const emitter = new events.EventEmitter();

const { developer, interface, example } = require('./mapper');
const routers = {};
var server_info = {};

function ProxyError(code, msg) {
    this.name = 'ProxyError';
    this.code = code || 500;
    this.message = msg || 'Internal Server Error';
    this.stack = (new Error()).stack;
}
ProxyError.prototype = Object.create(Error.prototype);
ProxyError.prototype.constructor = ProxyError;

interface.findAll({ attributes: ["id", "method", "router"] }).then(interfaces => {
    for (var intfcl of interfaces) {
        routers[intfcl.id] = new Layer(intfcl);
    }
});

function send_proxy(req, res, developerId) {
    return developer.findById(developerId, { attributes: ["addr", "port"] }).then(result => {
        if (result) {
            req.headers["host"] = result.addr;
            var _req = http.request({
                host: result.addr,
                port: result.port,
                path: req.url,
                method: req.method,
                headers: req.headers
            }, function (_res) {
                res.writeHead(_res.statusCode, _res.headers)
                _res.pipe(res);
                return;
            }).on("error", err => {
                console.error(err);
                throw new ProxyError(500, "Remote Request Failed");
            });
            req.pipe(_req);
            return;
        } else {
            throw new ProxyError(404, "No Avaliable Proxy Is Specified");
        }
    });
}

function send_example(req, res, interfaceId) {
    return example.findAll({ where: { interfaceId: interfaceId, inUse: true }, include: ["cookies", "content", "code"] }).then(results => {
        if (null == results || results.length == 0) throw new ProxyError(404, "No Avaliable Response Is Specified");
        var response = results[Math.floor(results.length * Math.random())];
        response.cookies && res.setHeader("Set-Cookie", response.cookies);
        response.content && res.write(response.content);
        res.statusCode = response.code;
        res.end();
    })
}

const app = http.createServer(function (req, res) {
    for (var i in routers) {
        var router = routers[i];
        if (req.method.toLocaleLowerCase() === router.method && router.reg.test(req.url.split("?")[0])) {
            interface.findById(router.id, { attributes: ["developerId", "isProxy"] }).then(result => {
                return result.isProxy ? send_proxy(req, res, result.developerId) : send_example(req, res, router.id);
            }).catch(e => {
                console.error(e);
                if (e instanceof (ProxyError)) {
                    res.statusCode = e.code;
                    res.write(e.message);
                } else {
                    res.statusCode = 500;
                    res.write("Internal Server Error");
                }
                res.end();
            });
            return;
        }
    }
    res.statusCode = 404;
    res.write("Response Not Found");
    res.end();
});

function Layer(data) {
    var _ = this;
    _.id = data.id;

    if (data.router && data.method) {
        _.reg = pathToRegexp(data.router);
        _.method = data.method;
    } else {
        interface.findById(_.id, { attributes: ["method", "router"] }).then(result => {
            _.reg = pathToRegexp(result.router);
            _.method = result.method;
        });
    }
}

exports.setInterface = function (data) {
    var id = parseInt(data.id);
    if (isNaN(id)) throw new Error("Fail to get interface id");
    routers[id] = new Layer(data);
    socketio.update_interface();
}

exports.delInterface = function (key) {
    routers[key] && delete routers[key];
}

exports.start = function (port) {
    app.listen(port);
    exports.info = {
        port: port,
        startTime: Date.now()
    };
    console.info(`proxy server listen on ${port}`);
}

exports.stop = function () {
    app.close();
    exports.info = {};
    console.info(`proxy server stop`);
}
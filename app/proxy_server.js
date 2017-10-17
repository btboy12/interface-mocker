const http = require('http');
const pathToRegexp = require('path-to-regexp');
const { developer, interface, example } = require('./mapper');
const routers = {};
var server_info = {};

interface.findAll().then(interfaces => {
    for (var intfcl of interfaces) {
        routers[intfcl.id] = new Layer(intfcl);
    }
});

const app = http.createServer(function (req, res) {
    for (var i in routers) {
        var router = routers[i];
        if (req.method.toLocaleLowerCase() === router.method && router.reg.test(req.url.split("?")[0])) {
            if (router.response && router.response.length) {
                var _response = router.response[Math.floor(router.response.length * Math.random())];
                _response.cookies && res.setHeader("Set-Cookie", _response.cookies);
                _response.content && res.write(_response.content);
                res.statusCode = _response.code;
                res.end();
                return;
            } else {
                req.headers["host"] = router.developer.addr;
                var _req = http.request({
                    host: router.developer.addr,
                    port: router.developer.port,
                    path: req.url,
                    method: router.method,
                    headers: req.headers
                }, function (_res) {
                    res.writeHead(_res.statusCode, _res.headers)
                    _res.pipe(res);
                }).on("error", err => {
                    console.error(err);
                    res.statusCode = 400;
                    res.write("Remote Request Failed");
                    res.end();
                }).end();
                return;
            }
        }
    }
    res.statusCode = 404;
    res.end();
    return;
});

function Layer(data) {
    var _ = this;
    _.id = data.id;
    _.reg = pathToRegexp(data.router);
    _.method = data.method;
    _.developerId = data.developerId;

    _.update = function () {
        example.findAll({
            attributes: ['cookies', 'content', 'code'],
            where: {
                interfaceId: _.id,
                inUse: true
            }
        }).then(function (examples) {
            _.response = examples;
        });
        developer.findById(_.developerId, { attributes: ["addr", "port"] }).then(result => {
            _.developer = result.get({ plain: true });
        });
    };

    _.update();
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

exports.update = function (key, param) {
    if (routers[key]) {
        routers[key].update(param);
    } else {
        interface.findById(key, {
            include: {
                model: developer,
                attributes: ['addr', "port"]
            }
        }).then((interface) => {
            interface && (routers[interface.id] = new Layer(interface));
        });
    }
}

exports.del = function (key) {
}


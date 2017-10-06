const http = require('http');
const pathToRegexp = require('path-to-regexp');
const { developer, interface, example } = require('./mapper');
const routers = {};

interface.findAll({
    include: {
        model: developer,
        attributes: ['addr', "port"]
    }
}).then(interfaces => {
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
                http.request({
                    host: router.developer.addr,
                    port: router.developer.port,
                    path: req.url,
                    method: router.method,
                    headers: req.headers
                }, function (_res) {
                    res.writeHead(_res.statusCode, _res.headers)
                    _res.pipe(res);
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
    _.developer = data.developer;
    _.method = data.method;


    _.setResponse = function setResponse() {
        example.findAll({
            attributes: ['cookies', 'content', 'code'],
            where: {
                interfaceId: _.id,
                inUse: true
            }
        }).then(function (examples) {
            _.response = examples;
        });
    };

    _.setResponse();
}

exports.start = function (port) {
    app.listen(port);
    console.info(`proxy server listen on ${port}`)
}

exports.stop = function () {
    app.close();
}

exports.update = function (key) {
    routers[key].setResponse();
}

exports.del = function (key) {
}


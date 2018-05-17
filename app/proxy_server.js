const http = require('http');
const pathToRegexp = require('path-to-regexp');
const events = require('events');
const socketio = require("./socketio");
const proxy = require("http-proxy").createProxy();

const { developer, interface, example } = require('./mapper');
const routers = {};
var server_info = {};
/**
 * 中转错误类
 * 
 * @param {Number} code - 错误码
 * @param {String} msg - 错误信息
 */
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
/**
 * 将请求转发给所属开发者
 * 
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 * @param {Number} developerId 
 * @returns 
 */
function send_proxy(req, res, developerId) {
    return developer.findById(developerId, { attributes: ["addr", "port"] }).then(result => {
        if (result) {
            proxy.web(req, res, {
                target: `http://${result.addr}:${result.port}`
            }, err => {
                console.error(err);
                throw new ProxyError(500, "Remote Request Failed");
            });
            return;
        } else {
            throw new ProxyError(404, "No Avaliable Proxy Is Specified");
        }
    });
}

/**
 * 随机发送启用中的返回样例
 * 
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 * @param {Number} developerId 
 * @returns 
 */
function send_example(req, res, interfaceId) {
    return example.findAll({ where: { interfaceId: interfaceId, inUse: true }, attributes: ["cookies", "content", "code"] }).then(results => {
        if (null == results || results.length == 0) throw new ProxyError(404, "No Avaliable Response Is Specified");
        var response = results[Math.floor(results.length * Math.random())];
        response.cookies && res.setHeader("Set-Cookie", response.cookies);
        res.setHeader("Content-Type", 'application/json;charset=UTF-8');
        response.content && res.write(response.content);
        res.statusCode = response.code;
        res.end();
    })
}

const app = http.createServer(function (req, res) {
    for (var i in routers) {
        var router = routers[i];
        try {
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
        } catch (err) {
            console.error(e);
            if (e instanceof (ProxyError)) {
                res.statusCode = e.code;
                res.write(e.message);
            } else {
                res.statusCode = 500;
                res.write("Internal Server Error");
            }
            res.end();
            return;
        }
    }
    res.statusCode = 404;
    res.write("Response Not Found");
    res.end();
});
/**
 * 设置路由
 * 
 * @param {Object} data - 传入接口信息
 * @param {Number} data.id - 接口ID
 * @param {String} data.router - 接口对应的路径。如没有传入则自动根据ID从数据库中获取
 * @param {String} data.method - 调用接口时使用的HTTP方法。如没有传入则自动根据ID从数据库中获取
 */
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
/**
 * 添加/修改接口
 * 
 * @param {Object} data - 接口信息
 * @param {Number} data.id - 接口ID
 * @param {String} data.router - 接口对应的路径。如没有传入则自动根据ID从数据库中获取
 * @param {String} data.method - 调用接口时使用的HTTP方法。如没有传入则自动根据ID从数据库中获取
 */
exports.setInterface = function (data) {
    var id = parseInt(data.id);
    if (isNaN(id)) throw new Error("Fail to get interface id");
    routers[id] = new Layer(data);
    socketio.update_interface();
}
/**
 * 删除指定接口的中转服务
 * 
 * @param {Number} key - 指定接口的ID
 */
exports.delInterface = function (key) {
    routers[key] && delete routers[key];
}
/**
 * 在指定接口启动中转服务器
 * 
 * @param {Number} port - 指定的接口
 */
exports.start = function (port) {
    app.listen(port);
    exports.info = {
        port: port,
        startTime: Date.now()
    };
    console.info(`proxy server listen on ${port}`);
}
/**
 * 关闭中转服务器
 * 
 */
exports.stop = function () {
    app.close();
    exports.info = {};
    console.info(`proxy server stop`);
}
const proxy_server = require("../proxy_server");

exports.path = "/api/proxy_server";

var handlers = {
    put: function (req, res) {
        if (true === req.body.switch) {
            proxy_server.start();
            res.status(200);
        } else if (false === req.body.switch) {
            proxy_server.stop();
            res.status(200);
        } else {
            res.status(400);
        }
        res.end();
    }
}

exports.handlers = handlers;
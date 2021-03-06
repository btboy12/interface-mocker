const proxy_server = require("../proxy_server");

exports.path = "/api/proxy_server";

var handlers = {
    get: function (req, res) {
        res.json(proxy_server.info);
    },
    patch: function (req, res) {
        if (typeof (req.body.switch) === "string") {
            if ("on" === req.body.switch.toLowerCase()) {
                proxy_server.start(8081);
                res.status(200);
            } else if ("off" === req.body.switch.toLowerCase()) {
                proxy_server.stop();
                res.status(200);
            } else {
                res.status(400);
            }
        } else {
            res.status(400);
        }

        res.end();
    }
}

exports.handlers = handlers;
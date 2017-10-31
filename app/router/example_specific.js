const { example } = require("../mapper.js");
const proxy_server = require("../proxy_server");

exports.path = "/api/example/:id";

var handlers = {
    get: function (req, res) {
        example.findById(req.params.id)
            .then(function (result) {
                res.json(result)
            }).catch(function (err) {
                console.warn(err);
                res.status(500).send();
            });
    },
    patch: function (req, res) {
        example.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(function (result) {
            proxy_server.emit("update interface", [result.interfaceId]);
            res.sendStatus(200);
        }).catch(function (err) {
            console.warn(err);
            res.sendStatus(500);
        });
    },
    delete: function (req, res) {
        example.findById(req.params.id)
            .then(function (result) {
                result.destroy();
            }).then(function () {
                res.sendStatus(200);
            }).catch(function (err) {
                console.warn(err);
                res.sendStatus(500);
            });
    }
}

exports.handlers = handlers;

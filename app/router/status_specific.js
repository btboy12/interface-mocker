const mapper = require("../mapper.js");

exports.path = "/api/status/:id";

var handlers = {
    get: function (req, res) {
        mapper.status.findById(req.params.id)
            .then(function (result) {
                res.json(result)
            }).catch(function (err) {
                console.warn(err);
                res.status(500).send();
            });
    },
    put: function (req, res) {
        mapper.status.findById(req.params.id)
            .then(function (result) {
                result.update(req.body);
            }).then(function () {
                res.sendStatus(200);
            }).catch(function (err) {
                console.warn(err);
                res.sendStatus(500);
            });
    },
    delete: function (req, res) {
        mapper.status.findById(req.params.id)
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

const {status} = require("../mapper.js");

exports.path = "/api/status";
var handlers = {
    get: function (req, res) {
        status.findAll().then(function (results) {
            res.json(results);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send();
        });
    },
    post: function (req, res) {
        status.create(req.body)
            .then(function (results) {
                res.sendStatus(200);
            }).catch(function (err) {
                console.error(err);
                res.sendStatus(500);
            })
    }
}
exports.handlers = handlers;


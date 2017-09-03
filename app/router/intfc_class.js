const mapper = require("../mapper.js");

exports.path = "/api/intfc_class";
var handlers = {
    get: function (req, res) {
        mapper.interface_class.findAll().then(function (results) {
            res.json(results);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send();
        });
    },
    post: function (req, res) {
        mapper.interface_class.create(req.body)
            .then(function (results) {
                res.sendStatus(200);
            }).catch(function (err) {
                console.error(err);
                res.sendStatus(500);
            })
    }
}
exports.handlers = handlers;


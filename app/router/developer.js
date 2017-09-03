const mapper = require("../mapper.js");

exports.path = "/api/developer";
var handlers = {
    get: function (req, res) {
        mapper.developer.findAll().then(function (results) {
            res.json(results);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send();
        });
    },
    post: function (req, res) {
        mapper.developer.create(req.body)
            .then(function (results) {
                res.sendStatus(200);
            }).catch(function (err) {
                console.error(err);
                res.sendStatus(500);
            })
    }
}
exports.handlers = handlers;


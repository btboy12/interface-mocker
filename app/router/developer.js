const { developer } = require("../mapper.js");

exports.path = "/api/developer";
var handlers = {
    get: function (req, res) {
        developer.findAll({
            attributes: ['id', 'name', 'addr', 'port']
        }).then(function (results) {
            res.json(results);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send();
        });
    },
    post: function (req, res) {
        developer.create(req.body)
            .then(function (results) {
                res.sendStatus(200);
            }).catch(function (err) {
                console.error(err);
                res.sendStatus(500);
            })
    }
}
exports.handlers = handlers;


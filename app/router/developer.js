const { developer } = require("../mapper.js");

exports.path = "/api/developer";
var handlers = {
    async get(req, res) {
        try {
            res.json(
                await developer.findAll({
                    attributes: ['id', 'name', 'addr', 'port']
                })
            );
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
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


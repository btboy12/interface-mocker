const { example, interface } = require("../mapper.js");

exports.path = "/api/example";
var handlers = {
    get: function (req, res) {
        example.findAll({
            attributes: ['id', 'name'],
            include: {
                model: interface,
                attributes: ['name']
            }
        }).then(function (results) {
            res.json(results);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send();
        });
    },
    post: function (req, res) {
        example.create(req.body)
            .then(function (results) {
                res.sendStatus(200);
            }).catch(function (err) {
                console.error(err);
                res.sendStatus(500);
            })
    }
}
exports.handlers = handlers;


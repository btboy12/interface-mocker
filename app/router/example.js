const { example, interface } = require("../mapper.js");

exports.path = "/api/example";
var handlers = {
    get: function (req, res) {
        var options;
        if (req.query.interface) {
            options = {
                where: {
                    interfaceId: req.query.interface
                }
            }
        } else {
            options = {
                attributes: ['id', 'name'],
                include: {
                    model: interface,
                    attributes: ['name']
                }
            }
        }
        example.findAll(options)
            .then(function (results) {
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


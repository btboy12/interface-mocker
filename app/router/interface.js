const { interface, developer, orm } = require("../mapper.js");

exports.path = "/api/interface";
var handlers = {
    get: function (req, res) {
        var options = {
            attributes: ['id', 'name', 'router'],
            include: {
                model: developer,
                attributes: ['name']
            }
        };
        interface.findAll(options).then(function (results) {
            res.json(results);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send();
        });
    },
    post: function (req, res) {
        interface.create(req.body)
            .then(function (results) {
                res.sendStatus(200);
            }).catch(function (err) {
                console.error(err);
                res.sendStatus(500);
            });
    }
}
exports.handlers = handlers;
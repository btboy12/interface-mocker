const mapper = require("../mapper.js");

exports.path = "/api/interface";
var handlers = {
    get: function (req, res) {
        mapper.interface.findAll({
            attributes: ['id', 'name', 'router'],
            include: {
                model: mapper.developer,
                attributes: ['name']
            }
        }).then(function (results) {
            for (var intfc of results) {
                intfc.setDataValue('developer', intfc.developer.getDataValue('name'));
            }
            res.json(results);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send();
        });
    },
    post: function (req, res) {
        mapper.interface.create(req.body)
            .then(function (interface) {
                mapper.developer.findById(req.body.developer).then(function (developer) {
                    interface.setDeveloper(developer);
                }).catch(function (err) {
                    console.error(err);
                    res.sendStatus(500);
                });
                mapper.interface_class.findById(req.body.type).then(function (c) {
                    interface.setInterface_class(c);
                }).catch(function (err) {
                    console.error(err);
                    res.sendStatus(500);
                });
                mapper.status.findAll({ where: { id: { $in: req.body["status[]"] } } }).then(function (c) {
                    interface.setStatuses(c);
                }).catch(function (err) {
                    console.error(err);
                    res.sendStatus(500);
                });
                res.sendStatus(200);
            }).catch(function (err) {
                console.error(err);
                res.sendStatus(500);
            });
    }
}
exports.handlers = handlers;
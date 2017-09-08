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
        mapper.orm.transaction(function (t) {
            return mapper.interface.create(req.body, { transaction: t })
                .then(function (interface) {
                    return interface.setStatuses(req.body["status[]"], { transaction: t });
                })
                .then(function () {
                    res.sendStatus(200);
                }).catch(function (err) {
                    console.error(err);
                    res.sendStatus(500);
                });
        })
    }
}
exports.handlers = handlers;
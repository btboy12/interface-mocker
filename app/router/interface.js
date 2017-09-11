const {interface,developer,orm} = require("../mapper.js");

exports.path = "/api/interface";
var handlers = {
    get: function (req, res) {
        interface.findAll({
            attributes: ['id', 'name', 'router'],
            include: {
                model: developer,
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
        orm.transaction(function (t) {
            return interface.create(req.body, { transaction: t })
                .then(function (intfc) {
                    return intfc.setStatuses(req.body["status[]"], { transaction: t });
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
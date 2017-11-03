const { interface } = require("../mapper.js");
const proxy_server = require("../proxy_server");

exports.path = "/api/interface/:id";

var handlers = {
    get: function (req, res) {
        interface.findById(req.params.id)
            .then(function (result) {
                res.json(result)
            }).catch(function (err) {
                console.warn(err);
                res.status(500).send();
            });
    },
    patch: function (req, res) {
        interface.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(function (result) {
            proxy_server.setInterface({id:req.params.id});
            res.sendStatus(200);
        }).catch(function (err) {
            console.warn(err);
            res.sendStatus(500);
        });
    },
    delete: function (req, res) {
        interface.destroy({ where: { id: req.params.id } })
            .then(function () {
                proxy_server.delInterface(req.params.id);
                res.sendStatus(200);
            }).catch(function (err) {
                console.warn(err);
                res.sendStatus(500);
            });
    }
}

exports.handlers = handlers;

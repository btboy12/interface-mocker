const { interface, developer, orm } = require("../mapper");
const { update } = require("../proxy_server");

exports.path = "/api/interface";
var handlers = {
    get: function (req, res) {
        var options = {
            attributes: ['id', 'name', 'router'],
            include: {
                model: developer,
                attributes: ['name']
            },
            where: {}
        };
        if (req.query.developerId) {
            options.where.developerId = req.query.developerId;
        } else if (req.query.search) {
            options.where.name = {
                $like: `%${req.query.search}%`
            }
        }
        interface.findAll(options).then(function (results) {
            res.json(results);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send();
        });
    },
    post: function (req, res) {
        interface.create(req.body)
            .then(function (result) {
                update(result.id);
                res.sendStatus(200);
            }).catch(function (err) {
                console.error(err);
                res.sendStatus(500);
            });
    }
}
exports.handlers = handlers;
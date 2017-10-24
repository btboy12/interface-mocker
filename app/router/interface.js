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
            where: {},
            offset: req.query.offset,
            limit: req.query.limit
        };
        if (req.query.developerId) {
            options.where.developerId = req.query.developerId;
        } else if (req.query.search) {
            options.where.name = {
                $like: `%${req.query.search}%`
            }
        }
        interface.findAndCountAll(options)
            .then(function (results) {
                // res.json({
                //     total: results.count,
                //     rows: results.rows
                // });
                res.json(results.rows);
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
const { example, interface, orm } = require("../mapper");
const { update } = require("../proxy_server");

exports.path = "/api/example";
var handlers = {
    get: function (req, res) {
        var options = {
            attributes: ['id', 'name'],
            include: {
                model: interface,
                attributes: ['name']
            },
            offset: req.query.offset,
            limit: req.query.limit
        };
        if (req.query.interface) {
            options.where = {
                interfaceId: req.query.interface
            }

        } else if (req.query.search) {
            options.where = {
                name: {
                    $like: `%${req.query.search}%`
                }
            }
        }
        example.findAndCountAll(options)
            .then(function (results) {
                res.json({
                    total: results.count,
                    rows: results.rows
                });
            }).catch(function (err) {
                console.error(err);
                res.status(500).send();
            });
    },
    post: function (req, res) {
        example.create(req.body)
            .then(function (result) {
                update(result.id);
                res.sendStatus(200);
            }).catch(function (err) {
                console.error(err);
                res.sendStatus(500);
            })
    },
    put: function (req, res) {
        orm.transaction(function (t) {
            return Promise.all(req.body.map(function (item) {
                if (item.id) {
                    return example.update(item, {
                        where: {
                            id: item.id
                        }
                    })
                }
                else {
                    example.create(item);
                }
            }));
        }).then(function () {
            update(req.query.interface);
            res.sendStatus(200);
        }).catch(function (err) {
            console.warn(err);
            res.sendStatus(500);
        });
    }
}
exports.handlers = handlers;


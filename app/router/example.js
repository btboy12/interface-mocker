const { example, interface, orm } = require("../mapper");
const proxy_server = require("../proxy_server");

exports.path = "/api/example";
var handlers = {
    get: function (req, res) {
        var options = {
            attributes: ['id', 'name', 'inUse'],
            include: {
                model: interface,
                attributes: ['name']
            },
            where: {},
            offset: req.query.offset,
            limit: req.query.limit
        };
        if (req.query.interfaceId) {
            options.where.interfaceId = req.query.interfaceId;
        }
        if (req.query.search) {
            options.where.name = {
                $like: `%${req.query.search}%`
            }
        }
        example.findAndCountAll(options)
            .then(function (results) {
                if (req.query.offset != undefined && req.query.limit != undefined) {
                    res.json({
                        total: results.count,
                        rows: results.rows
                    });
                } else {
                    res.json(results.rows);
                }
            }).catch(function (err) {
                console.error(err);
                res.status(500).send();
            });
    },
    post: function (req, res) {
        example.create(req.body)
            .then(function (result) {
                proxy_server.emit("update interface", [result.interfaceId]);
                res.sendStatus(200);
            }).catch(function (err) {
                console.error(err);
                res.sendStatus(500);
            })
    },
    // put: function (req, res) {
    //     orm.transaction(function (t) {
    //         return Promise.all(req.body.map(function (item) {
    //             if (item.id) {
    //                 return example.update(item, {
    //                     where: {
    //                         id: item.id
    //                     }
    //                 })
    //             }
    //             else {
    //                 example.create(item);
    //             }
    //         }));
    //     }).then(function () {
    //         update(req.query.interface);
    //         res.sendStatus(200);
    //     }).catch(function (err) {
    //         console.warn(err);
    //         res.sendStatus(500);
    //     });
    // }
}
exports.handlers = handlers;


const { developer } = require("../mapper");
const sha1 = require("sha1");
const { randChars } = require("../utils");

exports.path = "/api/login";
var handlers = {
    async post(req, res) {
        try {
            let { id, salt, psw } = await developer.findOne({
                attributes: ['id', 'salt', 'psw'],
                where: {
                    account: req.body.account
                },
            });
            if (psw !== sha1(sha1(req.body.psw) + salt)) throw new TypeError("wrong password");
            req.session.uid = id;
            res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            if (err instanceof TypeError) {
                res.sendStatus(400);
            }
            else {
                res.sendStatus(500);
            }
        }
    }
}
exports.handlers = handlers;
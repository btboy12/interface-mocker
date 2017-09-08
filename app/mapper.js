const Sequelize = require('sequelize');

const orm = new Sequelize({
    database: "interlong",
    dialect: 'sqlite',
    storage: 'database.db'
});

// 用户表
var developer = orm.define('developer', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false, validate: { notEmpty: true } },
    addr: { type: Sequelize.STRING, allowNull: false, validate: { notEmpty: true } },
    port: { type: Sequelize.INTEGER, allowNull: false, validate: { notEmpty: true } }
});

// 接口分表表
var interface_class = orm.define("interface_class", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false, validate: { notEmpty: true } }
});

// 返回状态码表
var status = orm.define('status', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: Sequelize.INTEGER, allowNull: false, validate: { notEmpty: true } },
    description: { type: Sequelize.STRING }
});

// 接口表
var interface = orm.define('interface', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false, validate: { notEmpty: true } },
    router: { type: Sequelize.STRING, allowNull: false, validate: { notEmpty: true } },
    reqInfo: { type: Sequelize.STRING },
    reqInfo: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING }
});
interface.belongsTo(developer);
interface.belongsTo(interface_class);

interface.belongsToMany(status, { through: "interfc_status" });
status.belongsToMany(interface, { through: "interfc_status" });

// 返回示例表
var sample = orm.define("sample", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    content: { type: Sequelize.STRING, allowNull: false, validate: { notEmpty: true } },
});
sample.belongsTo(interface);

// 测试样例表
var test_exmp = orm.define('test_exmp', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    expected: { type: Sequelize.STRING, allowNull: false, validate: { notEmpty: true } },
    description: { type: Sequelize.STRING }
});
test_exmp.belongsTo(interface);

// orm.sync({ force: true });
orm.sync();

exports.orm = orm;
exports.interface = interface;
exports.developer = developer;
exports.test_exmp = test_exmp;
exports.status = status;
exports.interface_class = interface_class;
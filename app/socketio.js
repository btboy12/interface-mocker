const { interface } = require("./mapper");
const proxy_server = require("./proxy_server");

var io;
exports.create = server => {
    io = require('socket.io')(server);
    io.clients
    io.on("connect", socket => {
        console.info("get socket");
        socket.emit("proxy info", {
            protocol: "http",
            port: proxy_server.port,
            host: "211.83.110.4"
        })
        interface.findAll({ attributes: ["router", "method"] })
            .then((results) => { socket.emit("interface list", results) });
    });
}

exports.update_interface = () => {
    interface.findAll({ attributes: ["router", "method"] })
        .then((results) => { io.emit("interface list", results) });
}
const { interface } = require("./mapper");
const proxy_server = require("./proxy_server");

var io;
exports.create = server => {
    io = require('socket.io')(server);
    io.clients
    io.on("connect", socket => {
        socket.on("project", id => {
            console.info(`new member of room ${id}`);
            socket.join(`project/${id}`, err => {
                if (err) {
                    console.error(err);
                    return;
                } else {
                    socket.emit("proxy info", {
                        protocol: "http",
                        port: proxy_server.info.port
                    })
                    interface.findAll({ attributes: ["router", "method"] })
                        .then((results) => { socket.emit("interface list", results) });
                }
            })
        })

    });
}

exports.update_interface = () => {
    interface.findAll({ attributes: ["router", "method"] })
        .then((results) => { io.emit("interface list", results) });
}
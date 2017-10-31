const { interface } = require("./mapper");

var io;
exports.create = server => {
    io = require('socket.io')(server);
    io.clients
    io.on("connect", socket => {
        console.info("get socket");
        interface.findAll({ attributes: ["router", "method"] })
            .then((results) => { socket.emit("interface list", results) });
    });
}

exports.update_interface = () => {
    interface.findAll({ attributes: ["router", "method"] })
        .then((results) => { io.emit("interface list", results) });
}
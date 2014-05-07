var io = require('socket.io').listen(process.env.ANGULAR_NODE_PORT|80);

io.sockets.on('connection', function (socket) {

});

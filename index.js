const express = require("express");
const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/room', function (req, res) {
  res.sendFile(__dirname + '/room.html');
});

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });
});

http.listen(port, '127.0.0.1', function () { //192.168.8.101
  console.log('listening on *:' + port);
});
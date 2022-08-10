const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set current folder 
app.use(express.static(path.join(__dirname, './')));

//when client connects
io.on('connection', socket => {
    io.to(socket.id).emit('socketid', socket.id)

    //broadcast on connect

    //get order text
    socket.on('serverOrder', data => {
        io.emit('message', data)
    })

    socket.on('serverAccept', data => {
        io.to(data.idCust).emit('accept', data)
    })
    socket.on('serverDecline', data => {
        io.to(data.idCust).emit('decline', data)
    })
    socket.on('serverReady', index => {
        io.emit('ready', index)
    })
    socket.on('delItemCust', data => {
        io.emit('del', data)
    })
    socket.on('placeOrderFinal', data => {
        io.emit('placeIndex', data)
    })
    socket.on('orderReadyFinal', data => {
        io.to(data.idCust).emit('readyIndexFinal', data)
    })

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server at ${PORT}`));


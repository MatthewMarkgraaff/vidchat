const socketActions = {
  connection: 'connection',
  disconnect: 'disconnect',
  createOrJoin: "create or join",
  created: "created",
  join: "join",
  joined: "joined",
  message: "message",
  data: "data",
};

const mountSocketIo = (ioInstance) => {
  ioInstance.on(socketActions.connection, function(socket) {
    socket.on(socketActions.message, (details) => {
      socket.broadcast.to(details.room).emit(socketActions.message, details);
    });

    socket.on(socketActions.createOrJoin, (room) => {
      const clientsInRoom = ioInstance.sockets.adapter.rooms[room];
      const numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

      if(numClients === 0) {
        socket.join(room);
        socket.emit(socketActions.created, room, socket.id);
      } else if(numClients === 1) {
        ioInstance.sockets.in(room).emit(socketActions.join, room);
        socket.join(room);
        socket.emit(socketActions.joined, room, socket.id);
      } else {
        console.log("Room full");
      }
    });

    socket.on(socketActions.disconnect, function(){
      console.log('user disconnected');
    });

  });
}

module.exports = mountSocketIo;

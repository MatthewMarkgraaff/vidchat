const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const callApp = require('./static');
const staticAssets = require('./serveAssets');
const mount = require('koa-mount');
const cors = require('@koa/cors');
const { landingRoutes } = require('./controllers');

app.use(views(__dirname + '/views', {
  map: {
    html: 'pug'
  },
  extension: 'pug',
  options: {
    basedir: require('path').join(__dirname + '/views')
  }
}));

app.use(cors());

app.use(mount('/call', callApp));
app.use(mount('/assets', staticAssets));

app.use(landingRoutes);

const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)

const socketActions = {
  createOrJoin: "create or join",
  created: "created",
  join: "join",
  joined: "joined",
  message: "message",
  data: "data",
};

io.on('connection', function(socket){
  console.log('connected')

  socket.on(socketActions.message, (msg) => {
    console.log(msg)
    socket.broadcast.emit('message', msg);
  });

  socket.on(socketActions.createOrJoin, (room) => {
    console.log('Received request to create or join room ' + room);
    const clientsInRoom = io.sockets.adapter.rooms[room];
    const numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

    if(numClients === 0) {
      socket.join(room);
      console.log("client id: " + socket.id + " created room " + room);
      socket.emit(socketActions.created, room, socket.id);
    } else if(numClients === 1) {
      io.sockets.in(room).emit(socketActions.join, room);
      socket.join(room);
      socket.emit(socketActions.joined, room, socket.id);
    } else {
      console.log("Room full");
    }
  });

});

server.listen(4000);

const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const callApp = require('./static');
const staticAssets = require('./serveAssets');
const mount = require('koa-mount');
const cors = require('@koa/cors');
const controllers = require('./controllers');
const mountSocketIo = require('./lib/mountSocketIo');

require('dotenv').config();

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

Object.keys(controllers).forEach(controller => {
  app.use(controllers[controller]);
});

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
mountSocketIo(io);

server.listen(process.env.PORT || 4000);

const Koa = require('koa');
const staticKoa = new Koa();
const serve = require('koa-static');
const path = require('path');

staticKoa.use(serve(path.join(__dirname, "./public/"), {}));

module.exports = staticKoa;

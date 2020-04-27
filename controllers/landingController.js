const Router = require('koa-router');
const router = new Router();
const { v1: uuidv1 } = require('uuid');

router.get('/', async (ctx, next) => {
  const uuid = `#${uuidv1()}`;
  await ctx.render('landing/index', { uuid });
});

module.exports = router;

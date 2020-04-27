const Router = require('koa-router');
const router = new Router();
const { getFormattedLatestCredentials } = require('../lib/validateCurrentTurnCredentials');

router.get('/turn-server-config', async (ctx, next) => {
  const formattedCredentials = await getFormattedLatestCredentials();
  ctx.body = formattedCredentials;
});

module.exports = router;

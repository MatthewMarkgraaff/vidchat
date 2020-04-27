const landingControllerRoutes = require('./landingController');
const callController = require('./callController');

module.exports = {
  landingRoutes: landingControllerRoutes.routes(),
  callRoutes: callController.routes(),
}

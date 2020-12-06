const express = require('express');

const router = express.Router();

const tokenMiddleware = require('../middlewares/token');
const permissionMiddleware = require('../middlewares/permission');
const notificationMiddleware = require('../middlewares/notification');

const groupRoute = require('../config/route-permission').configRouter;

/**
 * setup middleware.
 */
router.use('/:key',
  tokenMiddleware.checkToken,
  permissionMiddleware.getAccountPermissions,
  notificationMiddleware.getNotifications,
);


groupRoute.forEach((routeInstance) => {
  router[routeInstance.method](
    routeInstance.router,
    (req, res, next) => permissionMiddleware.checkPermission(
      req,
      res,
      next,
      routeInstance.allowPermission,
    ), routeInstance.controller
  );
});

module.exports = router;
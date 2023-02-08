var express = require("express");
var router = express.Router();
var passport = require("passport");
require("../../config/passport")(passport);

var orderController = require("../../controllers/order/orderController");
router.post(
  "/getOrder",
  passport.authenticate("headerapikey", { session: false }),
  orderController.getOrder
);

router.post(
  "/addOrder",
  passport.authenticate("headerapikey", { session: false }),
  orderController.addOrder
);

router.post(
  "/findOrder",
  passport.authenticate("headerapikey", { session: false }),
  orderController.findOrder
);

router.post(
  "/confirmOrder",
  passport.authenticate("headerapikey", { session: false }),
  orderController.confirmOrder
);

router.post(
  "/getactiveOrders",
  passport.authenticate("headerapikey", { session: false }),
  orderController.getactiveOrders
);
module.exports.router = router;

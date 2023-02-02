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
module.exports.router = router;

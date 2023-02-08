var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  // #swagger.description = 'Redirect to github Home'

  res.redirect("https://www.linkedin.com/in/rajveenz2/");
});

router.get("/ping", function (req, res) {
  // #swagger.description = 'Ping for checking status'

  res.status(200).send({ message: "Success" });
});

//admin
router.use("/admin/auth", require("./admin/authRoute").router);

//products
router.use("/product", require("./product/productRoute").router);

//table
router.use("/table", require("./table/tableRoute").router);

//order
router.use("/order", require("./order/orderRoute").router);

module.exports.router = router;

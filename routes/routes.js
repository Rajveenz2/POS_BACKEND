var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  // #swagger.description = 'Redirect to github Home'

  res.redirect("https://www.facebook.com")
})

router.get('/ping', function(req, res) {
  // #swagger.description = 'Ping for checking status'

  res.status(200).send({ message: "Success" });
})



//admin
router.use('/admin', require('./admin/dataRoute').router)
router.use('/admin/auth', require('./admin/authRoute').router)

module.exports.router = router;
var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../../config/passport')(passport);


var authController = require('../../controllers/admin/authController')

router.post('/login', passport.authenticate('headerapikey', {session: false}), authController.login);

router.post('/updateUser', authController.updateUser);

router.post('/logout', passport.authenticate('user-rule-admin', {session: false}), authController.logout);

router.post('/whoAmI', passport.authenticate('user-rule-admin', {session: false}), authController.whoAmI);


module.exports.router = router;
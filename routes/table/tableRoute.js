var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../../config/passport')(passport);


var dataController = require('../../controllers/table/tableController')
router.post('/addTable', passport.authenticate('headerapikey', {session: false}),dataController.addTable);

router.post('/getTables', passport.authenticate('user-rule-admin', {session: false}), dataController.getTables);

router.post('/getTableslength', passport.authenticate('headerapikey', {session: false}), dataController.getTableslength);

router.post('/getTable', passport.authenticate('headerapikey', {session: false}), dataController.getTable);

router.post('/deleteTable', passport.authenticate('headerapikey', {session: false}), dataController.deleteTable);
module.exports.router = router;
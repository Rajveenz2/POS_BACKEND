var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../../config/passport')(passport);


var tableController = require('../../controllers/table/tableController')
router.post('/addTable', passport.authenticate('headerapikey', {session: false}),tableController.addTable);

router.post('/getTables', passport.authenticate('user-rule-admin', {session: false}), tableController.getTables);

router.post('/getTableslength', passport.authenticate('headerapikey', {session: false}), tableController.getTableslength);

router.post('/getTable', passport.authenticate('headerapikey', {session: false}), tableController.getTable);

router.post('/getInactiveTables', passport.authenticate('headerapikey', {session: false}), tableController.getInactiveTables);

router.post('/deleteTable', passport.authenticate('headerapikey', {session: false}), tableController.deleteTable);
module.exports.router = router;
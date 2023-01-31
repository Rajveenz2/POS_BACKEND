var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../../config/passport')(passport);


var dataController = require('../../controllers/product/productController')

router.post('/getProducts', passport.authenticate('headerapikey', {session: false}), dataController.getProducts);

router.post('/getProduct', passport.authenticate('headerapikey', {session: false}), dataController.getProduct);

router.post('/updateProduct', passport.authenticate('headerapikey', {session: false}), dataController.updateProduct);

router.post('/deleteProduct', passport.authenticate('headerapikey', {session: false}), dataController.deleteProduct);

router.post('/addProduct', passport.authenticate('headerapikey', {session: false}), dataController.addProduct);

router.post('/addCostConfig', dataController.addCostConfig); // helper method to add cost to the db.

module.exports.router = router;
var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../../config/passport')(passport);


var dataController = require('../../controllers/admin/dataController')

router.post('/getConfiguration', passport.authenticate('headerapikey', {session: false}), dataController.getConfiguration);

router.post('/getConfigs', dataController.getConfigs);

router.post('/getDemographics', passport.authenticate('headerapikey', {session: false}), dataController.getDemographics);

router.post('/getUserDemographics', dataController.getUserDemographics);

router.post('/getQuote', passport.authenticate('headerapikey', {session: false}), dataController.getQuote);

router.post('/addCostConfig', dataController.addCostConfig); // helper method to add cost to the db.

router.post('/getTemplates', passport.authenticate('user-rule-admin', {session: false}), dataController.getTemplates);

router.post('/getDrafts', passport.authenticate('user-rule-admin', {session: false}), dataController.getDrafts);

router.post('/updateProjectDesc', dataController.updateProjectDesc);

router.post('/getProjectData', dataController.getProjectData);

router.post('/addProject', dataController.addProject)

router.post('/removeProject', dataController.removeProject)

router.post('/getSampleSplit', passport.authenticate('headerapikey', {session: false}), dataController.getSampleSplit)

router.post('/saveSampleSplit', passport.authenticate('headerapikey', {session: false}), dataController.saveSampleSplit)

router.post('/saveQuestionnaire', passport.authenticate('headerapikey', {session: false}), dataController.saveQuestionnaire)

router.post('/getQuestions', dataController.getQuestions)

router.post('/updateQuestions', dataController.saveQuestions)

router.post('/getCost', dataController.getCost)


module.exports.router = router;
'use strict';
var mongoose = require('mongoose');
var db = require('../db');

var DeletedUserSchema = new mongoose.Schema({
    name: String,
    email: String,
    countryCode: String,
    mobileNumber: String,
    created_at: { type: Date, default: Date.now },
});

DeletedUserSchema.index({ email: 1 });

module.exports = db.model('DeletedUser', DeletedUserSchema);
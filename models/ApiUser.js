'use strict';
var mongoose = require('mongoose');
var db = require('../userDB');

var ApiUserSchema = new mongoose.Schema({
    key: String,
    passcode : String,
    status: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: String,
    updated_by: String
});

ApiUserSchema.index({ key: 1, passcode: 1 }, { unique: true });

module.exports = db.model('ApiUser', ApiUserSchema);
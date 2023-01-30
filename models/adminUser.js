'use strict';
var mongoose = require('mongoose');
var db = require('../userDB');

var adminUserSchema = new mongoose.Schema({
    status: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    organization:  String,
    lastLogin: { type: Date },
    userId: { type: mongoose.Schema.Types.ObjectId},
    permissions: [],
    loggedIn : Boolean
});

adminUserSchema.index({ userId : 1 }, { unique: true });

module.exports = db.model('adminuser', adminUserSchema);
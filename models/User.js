'use strict';
var mongoose = require('mongoose');
var db = require('../userDB');
// var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const mongoosePaginate = require('mongoose-paginate-v2');

var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  countryCode: String,
  mobileNumber: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: String,
  updated_by: String,
  dummy: Boolean,
});

UserSchema.plugin(mongoosePaginate);
UserSchema.index({ name: 1, email: 1 }, { unique: true });
module.exports = db.model('User', UserSchema);
"use strict";
var mongoose = require("mongoose");
var db = require("../userDB");
// var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const mongoosePaginate = require("mongoose-paginate-v2");

var TableSchema = new mongoose.Schema({
  tableId: String,
  tableNumber: String,
  tableStatus: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  dummy: Boolean,
});

TableSchema.plugin(mongoosePaginate);
TableSchema.index({ tableId: 1 }, { unique: true });
module.exports = db.model("Table", TableSchema);

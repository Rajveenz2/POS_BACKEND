"use strict";
var mongoose = require("mongoose");
var db = require("../userDB");
// var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
var TableSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
});
const mongoosePaginate = require("mongoose-paginate-v2");

var OrderSchema = new mongoose.Schema({
  order: [],
  orderStatus: String,
  total: String,
  table: [TableSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  dummy: Boolean,
  orderType: String,
});

OrderSchema.plugin(mongoosePaginate);
OrderSchema.index();
module.exports = db.model("Order", OrderSchema);

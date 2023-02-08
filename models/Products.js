"use strict";
var mongoose = require("mongoose");
var db = require("../userDB");
// var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const mongoosePaginate = require("mongoose-paginate-v2");

var ProductSchema = new mongoose.Schema({
  productName: String,
  productPrice: String,
  productImageUrl: String,
  productDesc: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  productCategory: String,
  quantity: { type: Number },
  dummy: Boolean,
});

ProductSchema.plugin(mongoosePaginate);
ProductSchema.index({ productName: 1 }, { unique: true });
module.exports = db.model("Product", ProductSchema);

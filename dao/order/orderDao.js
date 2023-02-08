const order = require("../../models/Order");
let mongoose = require("mongoose");

module.exports = {
  async getOrder(params) {
    return await order.find({
      table: { $elemMatch: { _id: params._id } },
      $or: [{ orderStatus: "Pending" }, { orderStatus: "Delivered" }],
    });
  },

  async getactiveOrders() {
    return await order.find({
      orderStatus: "Pending",
    });
  },

  async addOrder(params) {
    let data = {
      order: params.order,
      orderStatus: "Pending",
      total: params.total,
    };
    return await order.create(data);
  },

  async confirmOrder(params) {
    let data = {
      order: params.order,
      orderStatus: "Pending",
      total: params.total,
      table: { _id: params.table },
      orderType: params.orderType,
    };
    return await order.findOneAndUpdate({ _id: params._id }, data);
  },

  async findOrder(params) {
    return await order.find({
      _id: params._id,
    });
  },
};

const order = require("../../models/Order");
let mongoose = require("mongoose");

module.exports = {
  async getOrder(params) {
    // console.log(params);
    // let b = {
    //   order: [
    //     {
    //       name: "Roti Canai",
    //       quantity: "2",
    //       total: "5",
    //     },
    //     {
    //       name: "Teh Ais",
    //       quantity: "1",
    //       total: "3.5",
    //     },
    //   ],
    //   orderStatus: "pending",
    //   table: { _id: params._id },
    //   currentTotal: "8.5",
    //   total: "8.5",
    //   addOns: "",
    // };
    // let a = await order.create(b);
    return await order.find({
      table: { $elemMatch: { _id: params._id } },
      $or :[{orderStatus: "Pending"} , {orderStatus: "Delivered"}],
    });
  },
};

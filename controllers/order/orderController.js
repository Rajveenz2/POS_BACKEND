const orderService = require("../../services/order/orderService");

module.exports = {
  getOrder: async function (req, res) {
    try {
      let order = await orderService.getOrder(req.body);
      res.status(200).send({ order, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  getactiveOrders: async function (req, res) {
    try {
      let order = await orderService.getactiveOrders();
      res.status(200).send({ order, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  addOrder: async function (req, res) {
    try {
      let addOrder = await orderService.addOrder(req.body);
      res.status(200).send({ addOrder, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  confirmOrder: async function (req, res) {
    try {
      let confirmOrder = await orderService.confirmOrder(req.body);
      res.status(200).send({ confirmOrder, message: "Order Successfully Placed" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  findOrder: async function (req, res) {
    try {
      let order = await orderService.findOrder(req.body);
      res.status(200).send({ order, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
};

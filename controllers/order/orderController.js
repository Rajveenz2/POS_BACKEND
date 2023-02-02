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
};

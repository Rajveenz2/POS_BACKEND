const orderDao = require("../../dao/order/orderDao");

module.exports = {
  async getOrder(params) {
    return await orderDao.getOrder(params);
  },
};

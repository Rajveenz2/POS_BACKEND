const orderDao = require("../../dao/order/orderDao");
const table = require("../../models/Tables");

module.exports = {
  async getOrder(params) {
    return await orderDao.getOrder(params);
  },

  async getactiveOrders() {
    let orders = await orderDao.getactiveOrders();
    for (let order of orders) {
      console.log(order.table == '')
      if (order.table != '') {
        let tableId = order.table[0]._id;
        let tableNumber = await table
          .find({ _id: tableId })
          .select("tableNumber , -_id");
        order.order.push(tableNumber[0]);
      }
      else{
        return 0
      }
      return orders;
    }
  },

  async addOrder(params) {
    return await orderDao.addOrder(params);
  },

  async confirmOrder(params) {
    let tableData = {
      tableStatus: "Active",
    };
    let updateTable = await table.findOneAndUpdate(
      { _id: params.table },
      tableData
    );
    return await orderDao.confirmOrder(params);
  },

  async findOrder(params) {
    return await orderDao.findOrder(params);
  },
};

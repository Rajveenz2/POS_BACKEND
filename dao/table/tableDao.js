const products = require("../../models/Tables");

module.exports = {
  async addTable(params) {
    params.tableId = params.tableNumber;
    params.tableStatus = 'Active'
    return await products.create(params);
  },

  async getTables() {
    return await products.find();
  },

  async getTableslength() {
    return await products.find();
  },

  async getActiveTableslength() {
    return await products.find({ tableStatus: 'Active'});
  },

  async getTable(params) {
    return await products.find(params);
  },

  async deleteTable(params) {
    console.log(params)
    return await products.deleteOne({ tableId: params });
  },
};

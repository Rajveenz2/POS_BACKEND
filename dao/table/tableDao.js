const table = require("../../models/Tables");

module.exports = {
  async addTable(params) {
    params.tableId = params.tableNumber;
    params.tableStatus = 'Inactive'
    return await table.create(params);
  },

  async getTables() {
    return await table.find();
  },

  async getTableslength() {
    return await table.find();
  },

  async getActiveTableslength() {
    return await table.find({ tableStatus: 'Active'});
  },

  async getInactiveTables() {
    return await table.find({ tableStatus: 'Inactive'});
  },

  async getTable(params) {
    return await table.find(params);
  },

  async deleteTable(params) {
    return await table.deleteOne({ _id: params });
  },
};

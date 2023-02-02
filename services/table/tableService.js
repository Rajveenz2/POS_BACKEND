const tableDao = require("../../dao/table/tableDao");

module.exports = {
  async addTable(params) {
    return await tableDao.addTable(params);
  },

  async getTables() {
    return await tableDao.getTables();
  },

  async getTableslength() {
    let totalTables = await tableDao.getTableslength();
    let activeTables = await tableDao.getActiveTableslength();
    let tables = totalTables.length;
    let active = activeTables.length;

    return { tables, active };
  },

  async getTable(params) {
    return await tableDao.getTable(params);
  },

  async deleteTable(params) {
    return await tableDao.deleteTable(params._id);
  },
};

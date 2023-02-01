const tableService = require("../../services/table/tableService");

module.exports = {
  addTable: async function (req, res) {
    try {
      let addTable = await tableService.addTable(req.body);
      res.status(200).send({ addTable, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  getTables: async function (req, res) {
    try {
      let tables = await tableService.getTables(req.body);
      res.status(200).send({ tables, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  getTableslength: async function (req, res) {
    try {
      let tablesLength = await tableService.getTableslength(req.body);
      res.status(200).send({ tablesLength, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  getTable: async function (req, res) {
    try {
      let table = await tableService.getTable(req.body);
      res.status(200).send({ table, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  deleteTable: async function (req, res) {
    try {
      let deleteTable = await tableService.deleteTable(req.body);
      res.status(200).send({ deleteTable, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
};

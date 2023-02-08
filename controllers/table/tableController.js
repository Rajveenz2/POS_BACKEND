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
    console.log(req.user.roles);
    let role = req.user.roles;
    let superAdmin = role.find(
      (element) => element == "ADMIN" || element == "CASHIER"
    );
    if (superAdmin == "ADMIN") {
      try {
        let tables = await tableService.getTables(req.body);
        res.status(200).send({ tables, message: "Success" });
      } catch (error) {
        res.status(400).send({ message: error.message });
      }
    }else{
      res.status(500).send({ message: 'User is not authorized to view or make changes here.' });
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

  getInactiveTables: async function (req, res) {
    try {
      let table = await tableService.getInactiveTables(req.body);
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

const dataService = require("../../services/admin/dataService");

module.exports = {
  getConfiguration: async function (req, res) {
    try {
      let config = await dataService.getConfiguration(req.body);
      res.status(200).send({ config, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  getConfigs: async function (req, res) {
    try {
      let config = await dataService.getConfigs(req.body);
      res.status(200).send({ config, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  getDemographics: async function (req, res) {
    try {
      let config = await dataService.getDemographics(req.body);
      res.status(200).send({ config, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  getUserDemographics: async function (req, res) {
    try {
      let config = await dataService.getUserDemographics(req.body);
      res.status(200).send({ config, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  getQuote: async function (req, res) {
    try {
      let quote = await dataService.getQuote(req.body);
      res.status(200).send({ quote, message: "Success" });
    } catch (error) {
      res.status(400).send({ error: true, message: error.message });
    }
  },

  addCostConfig: async function (req, res) {
    try {
      await dataService.addCostConfig(req.body);
      res.status(200).send({ message: "Success" });
    } catch (error) {
      res.status(400).send({ error: true, message: error.message });
    }
  },

  getTemplates: async function (req, res) {
    try {
      let templates = await dataService.getTemplates(req.body);
      res.status(200).send({ templates, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  getDrafts: async function (req, res) {
    try {
      let templates = await dataService.getDrafts(req.body);
      res.status(200).send({ templates, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  addProject: async function (req, res) {
    try {
      let projects = await dataService.addProject(req.body);
      res.status(200).send({ projects, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  removeProject: async function (req, res) {
    try {
      let projects = await dataService.removeProject(req.body);
      res.status(200).send({ projects, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  getProjectData: async function (req, res) {
    try {
      let templates = await dataService.getProjectData(req.body);
      res.status(200).send({ templates, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  updateProjectDesc: async function (req, res) {
    try {
      await dataService.updateProjectDesc(req.body);
      res.status(200).send({ message: "Success" });
    } catch (error) {
      res.status(400).send({ error: true, message: error.message });
    }
  },

  getSampleSplit: async function (req, res) {
    try {
      let sample = await dataService.getSampleSplit(req.body);
      res.status(200).send({ sample, message: "Success" });
    } catch (error) {
      res.status(400).send({ error: true, message: error.message });
    }
  },

  saveSampleSplit: async function (req, res) {
    try {
      await dataService.saveSampleSplit(req.body);
      res.status(200).send({ message: "Success" });
    } catch (error) {
      res.status(400).send({ error: true, message: error.message });
    }
  },

  saveQuestionnaire: async function (req, res) {
    try {
      let userDetails = JSON.parse(req.body.userDetails)
      await dataService.saveQuestionnaire({ files : req.files , userDetails : userDetails });
      res.status(200).send({ message: "Success" });
    } catch (error) {
      res.status(400).send({ error: true, message: error.message });
    }
  },

  getQuestions: async function (req, res) {
    try {
      let question = await dataService.getQuestions(req.body);
      res.status(200).send({ question, message: "Success" });
    } catch (error) {
      res.status(400).send({ error: true, message: error.message });
    }
  },

  saveQuestions: async function (req, res) {
    try {
      await dataService.saveQuestions(req.body);
      res.status(200).send({ message: "Success" });
    } catch (error) {
      res.status(400).send({ error: true, message: error.message });
    }
  },

  getCost: async function (req, res) {
    try {
      let cost = await dataService.getCost(req.body);
      res.status(200).send({ cost, message: "Success" });
    } catch (error) {
      res.status(400).send({ error: true, message: error.message });
    }
  },
};

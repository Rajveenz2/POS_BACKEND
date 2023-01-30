const configuration = require("../../models/adminUser");
const AdminCost = require("../../models/adminUser");
const currencyCode = require("../../models/adminUser");
const templates = require("../../models/adminUser");
const AdminProjects = require("../../models/adminUser");
const countryData = require("../../models/adminUser");
const AdminUser = require("../../models/adminUser");

module.exports = {
  async getConfiguration(configNames) {
    return await configuration.find({ name: { $in: configNames } });
  },

  async findAdminProject(params) {
    return await AdminProjects.findOne({
      _id: params,
    });
  },

  async updateAdminAudience(params) {
    return await AdminProjects.updateOne(
      {
        _id: params._id,
      },
      { $pull: {audience: {country : params.country} }}
    );
  },

  async addCountry(params) {
    return await AdminProjects.updateOne(
      {
        _id: params._id,
      },
      { $push: {audience: {country : params.country} }}
    );
  },

  async updateAdminQuestions(params) {
    return await AdminProjects.updateOne(
      {
        _id: params,
      },
      { $pull: { questions: {} } }
    );
  },

  async addSample(params) {
    return await AdminProjects.updateOne(
      {
        _id: params._id,
      },
      { $push: { audience: params.demo } }
    );
  },

  async addQuestions(params) {
    return await AdminProjects.updateOne(
      {
        _id: params._id,
      },
      { $push: { questions: params.questions } }
    );
  },

  async findAdminUser(params) {
    return await AdminUser.findOne({
      userId: params,
    });
  },

  async findActiveProjects(id, projectStatus) {
    return await AdminProjects
      .find({
        _id: id,
        projectStatus: 'A',
        upload: {$ne : true}
      })
      .select("projectData.templateId  data.projectName data.projectDesc -_id");
  },

  async getSampleSize(params) {
    return await AdminProjects
      .findOne({
        _id: params,
      })
      .select("projectData.sampleSize projectData.sampleSize1 projectData.sampleSize2 -_id");
  },

  async getUserCountry(data) {
    return await AdminProjects
      .findOne({
        _id: data,
      })
      .select("projectData.country -_id");
  },

  async getDemographics(data) {
    return await countryData
      .findOne({ name: data })
      .select("name regions races");
  },

  async getCountries() {
    return await countryData.find().select("name");
  },

  async addCostConfig(data) {
    return await AdminCost.create(data);
  },

  async getQuote(params) {
    return await AdminCost.findOne({
      $and: [
        { loi: params.loi },
        { min_incidence: { $lte: params.consumerSegment } },
        { max_incidence: { $gte: params.consumerSegment } },
      ],
    });
  },

  async getCurrencyCode(country) {
    return await currencyCode
      .findOne({
        name: country,
      })
      .select("currency");
  },

  async getTemplates(params) {
    if (params._id == null) {
      return await templates.find();
    } else {
      return await templates.findOne({ _id: params._id });
    }
  },

  async getTemplateName(params) {
    return await templates
      .findOne({
        _id: params,
      })
      .select("title");
  },

  async updateProjectDesc(params) {
    return await AdminProjects.findOneAndUpdate(
      {
        _id: params.projectId,
      },
      { $push: { data: params.data } }
    );
  },

  async removeProjectDesc(params) {
    return await AdminProjects.findOneAndUpdate(
      {
        _id: params._id,
      },
      { $pull: { data: {} } }
    );
  },

  async removeProject(params) {
    return await AdminProjects.findOneAndUpdate(
      {
        _id: params._id,
      },
      { projectStatus: "C" }
    );
  },

  async saveQuestionnaire(projectId, userId, fileName) {
    return await AdminProjects.findOneAndUpdate(
      {
        _id: projectId,
        userId: userId,
      },
      { $push: { questionnaire: fileName }, upload: true }
    );
  },

  async getQuestions(params) {
    return await templates
      .findOne({
        _id: params,
      })
      .select("title questions");
  },

  async getAudience(params) {
    return await AdminProjects
      .findOne({
        _id: params,
      })
      .select("audience -_id");
  },
};

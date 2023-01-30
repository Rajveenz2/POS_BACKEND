const dataDao = require("../../dao/admin/dataDao");
const authDao = require("../../dao/admin/authDao");
// const userDao = require("../../dao/buyer/admin/usersDao");
const settings = require("../../config/settings");
const util = require("../../Util");
const axios = require("axios");
const fs = require("fs");
const dropboxV2Api = require("dropbox-v2-api");
// const ExcelExport = require("../../mobileSubmodules/common/excelExport/processor");

module.exports = {
  async getConfiguration() {
    let config = await dataDao.getConfiguration([
      "INTEVIEW_LENGTH_OPTIONS",
      "IR_OPTIONS",
      "OUTPUT_OPTIONS",
      "TEMPLATES",
      "CONSUMER_SEGMENT",
      "DEMOGRAPHICS",
      "AGE_GROUPS",
    ]);
    let countries = await dataDao.getCountries();
    let toSendConfig = {};

    config.forEach((c) => {
      if (c.name === "INTEVIEW_LENGTH_OPTIONS") {
        toSendConfig.interviewLength = c.options;
      } else if (c.name === "IR_OPTIONS") {
        toSendConfig.ir = c.options;
      } else if (c.name === "OUTPUT_OPTIONS") {
        toSendConfig.output = c.options;
      } else if (c.name === "TEMPLATES") {
        toSendConfig.templates = c.options;
      } else if (c.name === "CONSUMER_SEGMENT") {
        toSendConfig.consumerSegment = c.options;
      } else if (c.name === "DEMOGRAPHICS") {
        toSendConfig.demographics = c.options;
      } else if (c.name === "AGE_GROUPS") {
        toSendConfig.age = c.options;
      }
      toSendConfig.countries = countries;
    });

    return toSendConfig;
  },

  async getUserDemographics(data) {
    let project = await dataDao.findAdminProject({
      _id: data._id,
    });

    let audience = await dataDao.getAudience(data._id);
    if (audience.audience.length == 1) {
      if (audience.audience[0].gender != null) {
        let numberOfCountries = project.projectData[0].country.length;
        let demo = audience.audience;
        return { demo, numberOfCountries };
      } else {
        return audience;
      }
    }
    if (audience.audience.length == 2) {
      if (
        audience.audience[0].gender != null ||
        audience.audience[1].gender != null
      ) {
        let numberOfCountries = project.projectData[0].country.length;
        let demo = audience.audience;
        return { demo, numberOfCountries };
      } else {
        return audience;
      }
    }
    if (audience.audience.length == 3) {
      if (
        audience.audience[0].gender != null ||
        audience.audience[1].gender != null ||
        audience.audience[2].gender != null
      ) {
        let numberOfCountries = project.projectData[0].country.length;
        let demo = audience.audience;
        return { demo, numberOfCountries };
      } else {
        return audience;
      }
    } else {
      return audience;
    }
  },

  async getDemographics(data) {
    let demographics = [];

    if (data.country == null && data.country == undefined) {
      countries = await dataDao.getUserCountry(data._id);
      for (let country of countries.projectData[0].country) {
        countryName = country;
        sampleSizes = await dataDao.getSampleSize(data._id);
        sampleSize = sampleSizes.projectData[0];
        let countryData = await dataDao.getDemographics(countryName);
        let config = await dataDao.getConfiguration(["AGE_GROUPS"]);

        demographics.push({ countryData, config, sampleSize });
      }
      let c = countries.projectData[0].country;
      return { demographics, c };
    } else {
      for (let country of data.country) {
        countryName = country;
        let countryData = await dataDao.getDemographics(countryName);
        let config = await dataDao.getConfiguration(["AGE_GROUPS"]);
        sampleSizes = await dataDao.getSampleSize(data.user.projectID);
        sampleSize = sampleSizes.projectData[0];

        demographics.push({ countryData, config, sampleSize });
      }
      let c = data.country;
      return { demographics, c };
    }
  },

  async addCostConfig(data) {
    return await dataDao.addCostConfig(data);
  },

  async getQuote(params) {
    let a = params.output;
    let output = [];
    if (a == 1) {
      output = 0;
    } else {
      output = a;
    }

    params.output = output;
    let dataToSend = [];
    let templateName = await dataDao.getTemplateName(params.templateId);

    let costConfig = await dataDao.getQuote(params);
    if (params.country[0] != null) {
      let currencyCode = await dataDao.getCurrencyCode(params.country[0]);
      currencyCode = currencyCode.currency;

      let totalCostinUSD = params.sampleSize * costConfig.costPerSampleinUSD;
      let outputAmount = totalCostinUSD * (params.output / 100); // Additional price depending on the deliverable
      totalCostinUSD = totalCostinUSD + Math.round(outputAmount);

      let exchangeRate = await util.convertCurrency(currencyCode);

      dataToSend.push({
        country: params.country[0],
        costInLocalCurrency: `${currencyCode}  ${(
          exchangeRate * totalCostinUSD
        ).toFixed(2)}`,
        costInUsd: totalCostinUSD.toFixed(2),
        template: templateName,
      });
    }

    if (params.country[1] != null) {
      let sample = [];
      if (params.sampleSize1 != null) {
        sample = params.sampleSize1;
      } else {
        sample = params.sampleSize;
      }
      let currencyCode = await dataDao.getCurrencyCode(params.country[1]);
      currencyCode = currencyCode.currency;

      let totalCostinUSD = sample * costConfig.costPerSampleinUSD;
      let outputAmount = totalCostinUSD * (params.output / 100); // Additional price depending on the deliverable
      totalCostinUSD = totalCostinUSD + Math.round(outputAmount);

      let exchangeRate = await util.convertCurrency(currencyCode);

      dataToSend.push({
        country: params.country[1],
        costInLocalCurrency: `${currencyCode}  ${(
          exchangeRate * totalCostinUSD
        ).toFixed(2)}`,
        costInUsd: totalCostinUSD.toFixed(2),
        template: templateName,
      });
    }

    if (params.country[2] != null) {
      let sample = [];
      if (params.sampleSize2 != null) {
        sample = params.sampleSize2;
      } else {
        sample = params.sampleSize;
      }
      let currencyCode = await dataDao.getCurrencyCode(params.country[2]);
      currencyCode = currencyCode.currency;

      let totalCostinUSD = sample * costConfig.costPerSampleinUSD;
      let outputAmount = totalCostinUSD * (params.output / 100); // Additional price depending on the deliverable
      totalCostinUSD = totalCostinUSD + Math.round(outputAmount);

      let exchangeRate = await util.convertCurrency(currencyCode);

      dataToSend.push({
        country: params.country[2],
        costInLocalCurrency: `${currencyCode}  ${(
          exchangeRate * totalCostinUSD
        ).toFixed(2)}`,
        costInUsd: totalCostinUSD.toFixed(2),
        template: templateName,
      });
    }

    return dataToSend;
  },

  async getTemplates(params) {
    return await dataDao.getTemplates(params);
  },

  async getDrafts(params) {
    let drafts = [];
    let templateIds = await userDao.findUser(params);

    for (let templateId of templateIds.projects) {
      let id = templateId.project_id;
      let templatess = await dataDao.findActiveProjects(id);

      for (let template of templatess) {
        let projects = template.projectData;
        let names = template.data;
        for (let project of projects) {
          data = await dataDao.getTemplates({ _id: project.templateId });
        }
        drafts.push({ names, data, id });
      }
    }
    return drafts;
  },

  async getConfigs(params) {
    let templateName = await dataDao.getTemplateName(params._id);
    let config = await this.getConfiguration();

    return { templateName, config };
  },

  async getProjectData(params) {
    let data = await dataDao.findAdminProject({
      _id: params._id,
    });
    let projectData = data.data;
    let templateId = data.projectData[0].templateId;
    let project = [];
    let template = await dataDao.getTemplates({ _id: templateId });
    project.push({ projectData, template });
    return project;
  },

  async updateProjectDesc(params) {
    let data = await dataDao.findAdminProject({
      _id: params.projectId,
    });
    if (data.data.length == 1) {
      await dataDao.removeProjectDesc({ _id: params.projectId });
      return await dataDao.updateProjectDesc(params);
    } else {
      return await dataDao.updateProjectDesc(params);
    }
  },

  async addProject(params) {
    let data = [];
    let sampleSize1 = params.project.sampleSize1;
    let sampleSize2 = params.project.sampleSize2;

    let sample = [];
    let sample2 = [];

    if (sampleSize1 == null) {
      sample = params.project.sampleSize;
    } else {
      sample = sampleSize1;
    }

    if (sampleSize2 == null) {
      sample2 = params.project.sampleSize;
    } else {
      sample2 = sampleSize2;
    }
    params.project.sampleSize1 = sample;
    params.project.sampleSize2 = sample2;

    let userId = params.userId;
    let projectData = params.project;
    let projectCost = params.cost;
    let projectStatus = "A";

    data.push({
      userId,
      projectData,
      projectCost,
      projectStatus,
    });

    let addData = await authDao.update(data);

    for (let c of projectData.country) {
      await dataDao.addCountry({
        _id: addData,
        country: c,
      });
    }
    return addData;
  },

  async removeProject(params) {
    return await dataDao.removeProject(params);
  },

  async getSampleSplit(params) {
    let g = params.gender;
    let r = params.race;
    let a = params.ageGroup;

    let sample = params.sampleSize;
    let genderSplit = params.sampleSize / params.gender.length;
    let raceSplit = Number(
      Math.round(genderSplit / params.race.length).toFixed(2)
    );
    let ageSplit = Number(
      Math.round(raceSplit / params.ageGroup.length).toFixed(2)
    );

    let gender = [];
    gender.push({ g, genderSplit });

    let race = [];
    race.push({ r, raceSplit });

    let age = [];
    age.push({ a, ageSplit });

    return { gender, race, age, sample };
  },

  async saveSampleSplit(params) {
    let a = await dataDao.findAdminProject({
      _id: params.data.projectID,
    });
    for (let data of a.audience) {
      let country = data.country;
      if (params.demo.country == country) {
        await dataDao.updateAdminAudience({
          _id: params.data.projectID,
          country: country,
          demo: params.demo,
        });

        await dataDao.addSample({
          _id: params.data.projectID,
          demo: params.demo,
        });
      }
    }
  },

  async saveQuestionnaire(params) {
    let projectId = params.userDetails.projectID;
    let userId = params.userDetails.userId;
    let fileName = projectId.concat(" ", params.files.file.name);

    if (params.files) {
      await this.saveFile(params.files.file, fileName);
    }
    await dataDao.saveQuestionnaire(projectId, userId, fileName);
    this.notifyOnSlack(params.files);
  },

  // async saveFile(file, name) {
  //   let folderPath = `questionnaires`;
  //   try {
  //     await file.mv(`./${folderPath}/${name}`);
  //     await ExcelExport.uploadToDropBox(`/${folderPath}/${name}`);
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("Error uploading file");
  //   }
  // },

  notifyOnSlack(file) {
    let text = "";

    if (file) {
      text =
        "There is a new project data / questionnaire uploaded. Please check the admin system for more details. You can find the uploaded file from the user here.. 👉🏼 URL: https://www.dropbox.com/scl/fo/92b17q43jn8m23uhyoqpv/h?dl=0&rlkey=48p50xbryjnfju2eaa4z8z3ti";
    } else {
      text =
        "There is a new project data / questionnaire uploaded. Please check the admin system for more details";
    }

    if (process.env.ENABLE_SLACK === "true") {
      console.log("Sending to Slack");
      axios.post(
        "https://hooks.slack.com/services/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",
        { text }
      );
      console.log("Sent to Slack");
    } else {
      console.log("Simulating sending to Slack");
    }
  },

  async getQuestions(params) {
    let template = await dataDao.findAdminProject(params.projectId);
    let questionsLength = {};
    let interview = template.projectData[0].interviewLength;

    if (interview === 10) {
      questionsLength = 15;
    } else if (interview === 20) {
      questionsLength = 30;
    } else {
      questionsLength = 45;
    }

    if (template.questions.length != 0) {
      let a = template.questions;
      return { a, questionsLength };
    } else {
      let templateId = template.projectData[0].templateId;
      return await dataDao.getQuestions(templateId);
    }
  },

  async saveQuestions(params) {
    let a = await dataDao.findAdminProject({
      _id: params.projectId,
    });

    if (a.questions.length === 0) {
      await dataDao.addQuestions({
        _id: params.projectId,
        questions: params.questions,
      });
    } else {
      await dataDao.updateAdminQuestions({ _id: params.projectId });
      await dataDao.addQuestions({
        _id: params.projectId,
        questions: params.questions,
      });
    }
  },

  async getCost(params) {
    let project = await dataDao.findAdminProject({ _id: params.projectId });
    let projectCost = project.projectCost;
    let totalCostinUSD = project.projectData[0].totalCostinUSD;

    return { projectCost, totalCostinUSD };
  },
};

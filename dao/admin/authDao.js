const adminUser = require("../../models/adminUser");
const User = require("../../models/User");
let mongoose = require("mongoose");

module.exports = {
  findUserById: async function (usrId) {
    return await User.findById(new mongoose.Types.ObjectId(usrId));
  },

  fetchUsers: async function (params) {
    let toSearchParams = {};

    if (params.userId != undefined) {
      toSearchParams.userId = new mongoose.Types.ObjectId(params.userId);
    }

    if (params._id != undefined) {
      toSearchParams._id = new mongoose.Types.ObjectId(params._id);
    }

    return await User.find(toSearchParams);
  },

  deleteUser: async function (params) {
    if (params.userId) {
      return await User.findByIdAndRemove(
        new mongoose.Types.ObjectId(params.userId)
      );
    } else {
      throw new Error("No user found");
    }
  },

  updateUser: async function (userDto) {
    try {
      let user = await adminUser.findOneAndUpdate({ _id: userDto._id }, userDto);
    } catch (e) {
      throw e;
    }
  },

  findUser: async function (params) {
    return await adminUser.findOne({
      userId: new mongoose.Types.ObjectId(params.userId),
    });
  },

  findadminUser: async function (params) {
    return await adminUser.findOne({
      userId: new mongoose.Types.ObjectId(params.userId),
    });
  },

  updateadminUser: async function (userDto) {
    await adminUser.findOneAndUpdate({ _id: userDto._id }, userDto);
  },
};

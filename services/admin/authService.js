const userDao = require("../../dao/admin/authDao");
const commonAuthService = require("../../userSubmodules/services/AuthService");
const userService = require("../../userSubmodules/services/UserService");
const util = require("../../Util");
const statusEnum = require("../../enums/commonStatusEnum");
// const EmailService = require("../../notificationSubmodules/services/emailService");
// const config = require("../../config/config");

module.exports = {
  async login(loginDto) {
    let user;
    try {
      user = await commonAuthService.authenticate(loginDto);
    } catch (error) {
      throw new Error(error.message);
    }

    if (undefined != user) {
      let localUser = await userDao.findUser({ userId: user._id });
      if (
        undefined == localUser ||
        localUser.status != statusEnum.ACTIVE.value
      ) {
        throw new Error("Email and password not found");
      }

      localUser.loggedIn = true;
      localUser.lastLogin = new Date();
      localUser.email = loginDto.email; // DO NOT REMOVE. Used for User management to fetch by email address and token generation.

      let token = await util.setupTokenForJwt(localUser);
      localUser.tempToken = token;
      userDao.updateUser(localUser); //update the login status of the user

      let returnobj = JSON.parse(JSON.stringify(localUser));
      returnobj.tempToken = token;
      returnobj.countryCode = user.countryCode;
      returnobj.mobileNumber = user.mobileNumber;
      returnobj.name = user.name;
      returnobj.email = user.email;

      return returnobj;
    } else {
      throw new Error("Unable to find user.");
    }
  },

  logout: async function (params) {
    let user = await userDao.findUser(params);

    if (null == user) {
      throw new Error("Invalid Used Passed In");
    }

    if (!user.loggedIn) {
      throw new Error(
        "User is already logged out. Someone trying to use others' token :)"
      );
    }

    user.loggedIn = false;
    await userDao.updateadminUser(user);
  },

  async updateUser(params) {
    if (params.data != null) {
      await userService.updateUser(params.data);
    }
    if (params.password.newPassword != null) {
      await commonAuthService.changePassword(params.password);
    }
  },

  findUser: async function (params) {
    let user = await userService.fetchUser(params);

    if (undefined != user) {
      let localUser = await userDao.findUser({ userId: user._id });

      if (localUser == undefined) {
        throw new Error("User does not exist.");
      }

      return { localUser: localUser, user };
    } else {
      throw new Error("Unable to find user.");
    }
  },
};

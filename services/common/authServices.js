let authDao = require("../../dao/common/authDao.js");
let UserDao = require("../../dao/buyer/admin/usersDao");
let ApiUserDao = require("../../dao/common/apiUserDao");
let Util = require("../../Util");
let statusEnum = require("../../enums/commonStatusEnum");
let redisClient = require("../../config/redis");
let commonAuthService = require("../../userSubmodules/services/AuthService");
let commonUserService = require("../../userSubmodules/services/UserService");

module.exports = {
  login: async function (loginDto) {
    let user;
    try {
      user = await commonAuthService.authenticate(loginDto);
    } catch (error) {
      throw new Error(error.message);
    }

    if (undefined != user) {
      let localUser = await UserDao.findUser({ userId: user._id });
      if (
        undefined == localUser ||
        localUser.status != statusEnum.ACTIVE.value
      ) {
        throw new Error("Email and password not found");
      }

      // localUser.loggedIn = true
      // localUser.lastLogin = new Date()
      localUser.email = loginDto.email; // DO NOT REMOVE. Used for User management to fetch by email address and token generation.

      let token = await Util.setupTokenForJwt(localUser);
      localUser.tempToken = token;
      UserDao.updateUser(localUser); //update the login status of the user

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

  register: async function (userDto) {
    try {
      // this will post to the centralized user database.
      let centralUser;
      try {
        centralUser = await commonAuthService.register(userDto);
      } catch (error) {
        throw new Error(error.message);
      }

      userDto.userId = centralUser._id;
      userDto.status = statusEnum.ACTIVE.value;

      // find the user if it exist based on email address
      let existingUser = await UserDao.findUser(userDto.userId);
      // check if the user exists in the local database, if so check status
      if (null != existingUser) {
        throw new Error(
          "User has registered previously. Please login using your registered credentials or reset your password."
        );
      }
      await authDao.registerUser(userDto);
    } catch (err) {
      throw err;
    }

    return userDto;
  },

  findUser: async function (payload) {
    let user = await commonUserService.fetchUser(payload);

    if (undefined != user) {
      let localUser = await UserDao.findUser({ userId: user._id });
      if (localUser == undefined) {
        throw new Error("User does not exist.");
      }
      return { localUser: localUser, user };
    } else {
      throw new Error("Unable to find user.");
    }
  },

  findAdminUser: async function (payload) {
    let user = await commonUserService.fetchUser(payload);

    if (undefined != user) {
      let localUser = await UserDao.findAdminUser({ userId: user._id });
      if (localUser == undefined) {
        throw new Error("User does not exist.");
      }
      return { localUser: localUser, user };
    } else {
      throw new Error("Unable to find user.");
    }
  },

  changePassword: async function (changePasswordRequest) {
    if (
      changePasswordRequest.newPassword !=
      changePasswordRequest.confirmNewPassword
    ) {
      throw new Error("Passwords do not match.");
    }
    let user = await UserDao.findUserById(changePasswordRequest._id);

    if (undefined == user) {
      throw new Error("User not found in the database");
    }

    changePasswordRequest.userId = user.userId;
    await commonAuthService.changePassword(changePasswordRequest);
  },

  logout: async function (userId) {
    let user = await UserDao.findUserById(userId);

    if (null == user) {
      throw new Error("Invalid Used Passed In");
    }

    if (!user.loggedIn) {
      throw new Error(
        "User is already logged out. Someone trying to use others' token :)"
      );
    }

    user.loggedIn = false;
    await UserDao.updateUser(user);

    return user;
  },

  authenticateApiUser: async function (key, passcode) {
    let headerApiUsers = await redisClient.get(`headerApiKey-${key}`);

    if (undefined == headerApiUsers) {
      headerApiUsers = await ApiUserDao.find(key, passcode);
      redisClient.set(
        `headerApiKey-${key}`,
        21600,
        JSON.stringify(headerApiUsers)
      );
    } else {
      headerApiUsers = JSON.parse(headerApiUsers);
    }

    if (headerApiUsers.length == 1) {
      return headerApiUsers[0];
    } else {
      throw new Error("Failed to retrieve api user.");
    }
  },

  authenticateUserToken: async function (token) {
    let payload = Util.decodeJWT(token);
    let user = await this.findUser(payload);

    if (user.localUser == null) {
      throw new Error({
        message: "Data tempered detected. Details do not match - 3",
      });
    } else {
      if (
        !user.localUser.loggedIn ||
        user.localUser._id != payload._id ||
        user.localUser.dateOfBirth != payload.dateOfBirth
      )
        throw new Error({ message: "Session Expired. Please login again." });
      else if (
        new Date(user.localUser.lastLogin).toString() !=
        new Date(payload.lastLogin).toString()
      )
        throw new Error({
          message: "Another login has been detected. Please login again.",
        });
    }

    return { valid: true };
  },

  resetPassword: async function (param) {
    let user = await this.findUser(param);
    let checkLinkExists = await authDao.validateLink({
      userId: user.localUser._id,
    });

    if (checkLinkExists.length > 0) {
      await authDao.updateExistingLink({
        id: checkLinkExists[0]._id,
        valid: false,
      });
    }

    await authDao.savePasswordCode({
      email: user.user.email,
      code: Util.generateRandomString(7),
      userId: user.localUser._id,
    });
  },

  validatePasswordLink: async function (data) {
    let validateLink = await authDao.validateLink(data);
    return validateLink;
  },
};

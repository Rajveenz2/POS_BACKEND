const UserDao = require("../dao/UserDao");
const bcrypt = require("bcryptjs");

module.exports = {
  authenticate: async function (loginDto) {
    let user = await UserDao.fetchUser({ email: loginDto.email });

    if (undefined == user) {
      throw new Error("Email and password not found in the database");
    }

    if (undefined == user.password) {
      throw new Error(
        "Password not set for this account. Please check your email."
      );
    }

    if (!bcrypt.compareSync(loginDto.password, user.password)) {
      throw new Error("Password does not match.");
    }

    return user;
  },

  register: async function (userDto) {
    userDto.email = userDto.email.toLowerCase();

    if (userDto.mobileNumber == undefined) {
      userDto.countryCode = undefined;
    }

    // find the user if it exist based on email address, contact number and idfa
    let existingUsers = await UserDao.checkUserRegistration(userDto);

    if (existingUsers.length == 1) {
      if (userDto.registrationType == "census") {
        existingUsers[0].mobileNumber = userDto.mobileNumber;
        await UserDao.updateUser(existingUsers[0]);
      }

      if (
        existingUsers[0].email.toLowerCase() == userDto.email.toLowerCase() &&
        existingUsers[0].countryCode == userDto.countryCode &&
        existingUsers[0].mobileNumber == userDto.mobileNumber
      ) {
        return existingUsers[0];
      } else {
        throw new Error("Username or mobile number has been registered.");
      }
    } else if (existingUsers.length == 0) {
      // user does not exist. Need to create one.
      if (userDto.password) {
        userDto.password = bcrypt.hashSync(userDto.password, 8); // hash the password to be saved into the db.
      }
      return await UserDao.registerUser(userDto);
    } else {
      throw new Error("Username or mobile number has been registered.");
    }
  },

  changePassword: async function (changePasswordRequest) {
    let user = await UserDao.fetchUser(changePasswordRequest);

    if (
      changePasswordRequest.newPassword !=
      changePasswordRequest.confirmNewPassword
    ) {
      throw new Error("Passwords do not match.");
    }

    if (undefined == user) {
      throw new Error("Username not found in the database");
    }

    if (
      !bcrypt.compareSync(changePasswordRequest.currentPassword, user.password)
    ) {
      throw new Error("Old Password does not match.");
    }

    let hashedPassword = bcrypt.hashSync(changePasswordRequest.newPassword, 8);
    user.password = hashedPassword;
    await UserDao.updateUser(user);
  },

  resetPassword: async function (resetPasswordRequest) {
    if (
      resetPasswordRequest.newPassword !=
      resetPasswordRequest.confirmNewPassword
    ) {
      throw new Error("Password does not match.");
    }

    let user = await UserDao.fetchUser(resetPasswordRequest);

    if (
      undefined == user ||
      user._id.toString() != resetPasswordRequest.userId.toString()
    ) {
      throw new Error("Username not found in the database");
    }

    let hashedPassword = bcrypt.hashSync(resetPasswordRequest.newPassword, 8);
    user.password = hashedPassword;

    await UserDao.updateUser(user);
  },

  setPassword: async function (data) {
    let checkUserExists = await UserDao.fetchUser({ userId: data.umId });

    if (undefined == checkUserExists) {
      throw new Error("Username not found in the database");
    }

    // if (checkUserExists.password) {
    //     throw new Error("Password already set for this email.")
    // }

    let hashedPassword = bcrypt.hashSync(data.password, 8);
    data.password = hashedPassword;
    data._id = data.umId;

    await UserDao.updateUser(data);
  },
};

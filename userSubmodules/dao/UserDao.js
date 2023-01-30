const User = require("../models/User");
const DeletedUser = require("../models/DeletedUser")
var mongoose = require('mongoose');

module.exports = {
  fetchUser: async function (params) {
    let searchObj = {}

    if (params.userId) {
      searchObj._id = params.userId
    } 
    
    if (params.email) {
      searchObj.email = params.email.toLowerCase();
    }

    return await User.findOne(searchObj)
  },

  fetchUsers: async function (params) {
    let pipeline = []

    if (params.userIds != undefined && params.userIds != null) {  
      pipeline.push({
        $match: {
          _id: {
            $in: params.userIds.map(userId => new mongoose.Types.ObjectId(userId))
          }
        }
      })
    }

    if (params.emails != undefined && params.emails != null) {
      pipeline.push({
        $match: {
          email: {
            $in: params.emails.map(email => email.toLowerCase())
          }
        }
      })
    }

    pipeline.push({
      $project: {
        _id: "$_id",
        name: "$name",
        countryCode: "$countryCode",
        mobileNumber: "$mobileNumber",
        email: "$email",
        created_at: "$created_at"
      }
    })

    return await User.aggregate(pipeline).allowDiskUse(true)
  },

  registerUser: async function (userDto) {
    let user;
    
    try {
      if (undefined != userDto._id) {
        userDto.updated_at = new Date()
        user = await User.findOneAndUpdate({
          '_id': userDto._id
        }, userDto, {
          upsert: true,
          new: true
        });
      } else {
        user = await User.create(userDto);
      }
    } catch (e) {
      throw e;
    }

    return user
  },

  updateUser: async function (user) {
    user.updated_at = new Date()
    
    return await User.findOneAndUpdate({
      '_id': user._id
    }, user, {
      upsert: true,
    });
  },

  checkUserRegistration: async function (registrationDto) {
    let user = await User.find({
      $or: [
        {
          'email': registrationDto.email
        },
        {
          'countryCode': registrationDto.countryCode,
          'mobileNumber': registrationDto.mobileNumber
        }
      ]
    })
    return user
  },

  findUserByText: async function (userDto) {
    let data = await User.find({
      $or: [{
          "name": {
            "$regex": userDto.text,
            "$options": "i"
          }
        },
        {
          "email": {
            "$regex": userDto.text,
            "$options": "i"
          }
        },
        {
          "mobileNumber": {
            "$regex": userDto.text,
            "$options": "i"
          }
        }
      ]
    }).select('-password')

    return data
  },
  
  deleteUser: async function(userId) {
    return await User.deleteOne({
      _id: new mongoose.Types.ObjectId(userId)
    })
  },

  saveDeletedUserInfo: async function(user) {
    return await DeletedUser.create(user)
  }
}
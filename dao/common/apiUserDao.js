const ApiUser = require('../../models/ApiUser')
const CommonStatusEnum = require('../../enums/commonStatusEnum')
module.exports = {
    async create(apiUser) {
        return await ApiUser.create(apiUser)
    },

    async update(apiUser) {
        return await User.findOneAndUpdate({ '_id': apiUser._id }, apiUser, { upsert: true });
    },

    async find(key, passcode) {
        return await ApiUser.find({ 'key': key, 'passcode': passcode, 'status': CommonStatusEnum.ACTIVE.value })
    }
}
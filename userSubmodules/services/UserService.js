const UserDao = require('../dao/UserDao')
let bcrypt = require('bcryptjs')

module.exports = {
    async updateUser(updateUserRequest) {
        let user = await UserDao.fetchUser(updateUserRequest)
        let original = JSON.parse(JSON.stringify(user));

        if (null == user) {
            throw new Error("User is not found. Possible tempering.")
        }

        if (updateUserRequest.password) {
            var hashedPassword = bcrypt.hashSync(updateUserRequest.password, 8);
            updateUserRequest.password = hashedPassword;
        }

        user = Object.assign(user, updateUserRequest)
        user.updated_at = new Date()
        let updatedUser = await UserDao.updateUser(user)

        return updatedUser
    },

    async fetchUser(params) {
        let user = await UserDao.fetchUser(params)

        if (undefined == user || user == null) {
            throw new Error('User with these details do not exist')  
        }

        return user
    },

    async fetchUsers(params) {
        return await UserDao.fetchUsers(params)
    },

    async findUserByText(userDto) {
        return await UserDao.findUserByText(userDto)
    },

    async deleteUser(user) {
        await this.saveDeletedUserInfo(user)
        try {
            return await UserDao.deleteUser(user.userId)
        } catch (error) {
            throw new Error(`Error ${error}`)
        }
    },

    async saveDeletedUserInfo(user) {
        return await UserDao.saveDeletedUserInfo(user)
    }
}
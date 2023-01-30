const authService = require("../../services/admin/authService")

module.exports = {
    login: async function(req, res) {
        try {
            let user = await authService.login(req.body)
            let token = user.tempToken
            user.tempToken = undefined
            res.status(200).send({ user: user, token: `Bearer ${token}` });
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    },

    updateUser: async function(req, res) {
        try {
            await authService.updateUser(req.body)
            res.status(200).send({ message : 'Success'  });
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    },

    logout: async function (req, res) {
        try {
            await authService.logout({ userId: req.user.userId } )
            res.status(200).send({ message: 'Successfully logged user out.' });
        } catch (e) {
            res.status(400).send({ message: 'Failed to logout' });
        }
    },

    whoAmI: async function (req, res) {
        try {
            let user = await authService.findUser({ ...req.body, userId: req.user.userId })
            res.status(200).send(user)
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    }
}
const Hashids = require('hashids/cjs')
const axios = require('axios')
const redisClient = require("./config/redis")
let roles = require('./enums/UserRoles'),
    jwt = require('jsonwebtoken'),
    settings = require('./config/settings')

module.exports = {
    isAdminUser: async function (user) {
        if (undefined != user && user.roles.length > 0) {
            return user.roles.includes(roles.ADMIN.value)
        }

        return false
    },

    setupTokenForJwt: async function (user) {
        let userForJwt = {
            '_id': user._id,
            'userId': user.userId,
            'email': user.email,
            'lastLogin': user.lastLogin
        }

        return jwt.sign(userForJwt, settings.secret, {
            expiresIn: 90 * 24 * 60 * 60 * 1000 // set the expiry to 90 days
        })
    },

    generateRandomString: function(length) {
        var chars = '123456789abcdefghijklmnopqrstvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        var randomString = ''
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                randomString += chars.charAt(Math.floor(Math.random() * chars.length))

            }
        }
        return randomString
    },

    decodeJWT: function(token) {
        try {
            return JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
        } catch (e) {
            return null;
        }
    },

    generateHashTimeStamp: function() {
        let hashids = new Hashids('IZC', 32)
        let hashTimstamp = hashids.encode(Date.now() + (30 * 60 * 1000))
        return hashTimstamp
    },

    convertCurrency: async function(currencyCode) {

        let exchangeRate = 0
        exchangeRate = await redisClient.get(`currency-code-${currencyCode}`)

        if (undefined == exchangeRate) {
            
            let url = settings.currencyConverter.url;
            url = url.split('[[currency]]').join(currencyCode);
    
            let response = await axios.get(url)
            if (response.data.success) {
                exchangeRate = response.data.quotes[`USD${currencyCode}`]
                redisClient.set(`currency-code-${currencyCode}`, 86400, exchangeRate)
            } else {
                throw new Error('Unable to retrive data [ERR-912]')
            }
        }

        return exchangeRate
    }
}
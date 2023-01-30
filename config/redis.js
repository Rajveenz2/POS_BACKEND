
const redis = require('redis'),
    bluebird = require('bluebird'),
    client = redis.createClient(process.env.REDISCLOUD_URL);

bluebird.promisifyAll(redis);

module.exports = {
    set: function (key, seconds = 86400, value) {
        client.setex(key, seconds, value, redis.print)
    },
    get: function (key) {
        return client.getAsync(key);
    },
    quit: function () {
        client.quit()
    },
    expire: function(key, seconds) {
        client.expire(key, seconds)
    }
} 
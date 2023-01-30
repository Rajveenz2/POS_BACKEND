'use strict';
var mongoose = require('mongoose');

module.exports = mongoose.createConnection(process.env.USER_DATABASE_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
});
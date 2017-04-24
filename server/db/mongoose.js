var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI);

module.exports = {mongoose};

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp'
mongoose.connect(MONGODB_URI);

module.exports = {mongoose};

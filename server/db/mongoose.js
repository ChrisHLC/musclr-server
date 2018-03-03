const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI)
    .catch((e) => console.log("Something went wrong " + e));

module.exports = {mongoose};

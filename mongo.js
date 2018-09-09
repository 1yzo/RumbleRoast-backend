const mongoose = require('mongoose');
const secrets = require('./secrets');

mongoose.Promise = global.Promise;

const username = secrets.mongoUser;
const password = secrets.mongoPass;
const mongoUri = `mongodb://${username}:${password}@ds046267.mlab.com:46267/rumble-roast`;

const connect = () => {
    return mongoose.connect(mongoUri, { useNewUrlParser: true });
};

module.exports = {
    connect,
    mongoose
};

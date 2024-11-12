const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/SemProject';

const connectToMongo = () =>
{
    try {
        mongoose.connect(mongoURI);
        console.log("Connected to database successfully.");
    } catch (error) {
        console.log("Failed to connect to database");
    }
}

module.exports = connectToMongo;
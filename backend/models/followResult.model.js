const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const followResultSchema = new Schema({
    surveyId: {
        type: String,
        required: true,
        trim: true
    },userId: {
        type: String,
        required: true,
        trim: true
    },frequencyId: {
        type: String,
        required: true,
        trim: true
    },follow: Array
});

const FollowResult = mongoose.model('FollowResult', followResultSchema);

module.exports = FollowResult;
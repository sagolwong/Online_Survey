const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const answerSchema = new Schema({
    surveyId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }, amountUser: Number,
    amountAnswer: Number,
    userIds: Array,
    answerUsers: Array
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const listSurveySchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }, listSurvey: Array
});

const ListSurvey = mongoose.model('ListSurvey', listSurveySchema);

module.exports = ListSurvey;
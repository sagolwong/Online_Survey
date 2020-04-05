const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const frequencySchema = new Schema({
    surveyId: {
        type: String,
        required: true,
        trim: true
    }, listTimeToDo: Array
});

const Frequency = mongoose.model('Frequency', frequencySchema);

module.exports = Frequency;
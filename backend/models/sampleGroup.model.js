const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sampleGroupSchema = new Schema({
    projectId: {
        type: String,
        required: true,
        trim: true
    }, nameSampleGroup: {
        type: String,
        required: true,
    },
});

const SampleGroup = mongoose.model('SampleGroup', sampleGroupSchema);

module.exports = SampleGroup;
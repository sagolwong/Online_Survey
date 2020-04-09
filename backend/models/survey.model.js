const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const surveySchema = new Schema({
    projectId: {
        type: String,
        required: true,
        trim: true
    }, userId: {
        type: String,
        required: true,
        trim: true
    }, sampleGroupId: {
        type: String,
        trim: true
    }, nameSurvey: {
        type: String,
        required: true,
        trim: true
    }, description: {
        type: String,
    }, shareTo: {
        type: String
    }, wantName: {
        type: Boolean,
        required: true
    },
    haveGroup: {
        type: Boolean,
        required: true
    },
    names: Array,
    frequency: {
        amount: {
            type: Number
        },
        unitsOfTime: {
            type: String
        }
    }, doOnce: {
        type: Boolean,
        required: true
    }, openAndCloseTimes: {
        start: {
            day: {
                type: Number
            }, month: {
                type: Number
            }, year: {
                type: Number
            }
        }, end: {
            day: {
                type: Number
            }, month: {
                type: Number
            }, year: {
                type: Number
            }
        }
    }, builtIns: Array,
    data: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["DRAFT", "PAUSE", "ONLINE", "FINISH"],
    }
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const templateSchema = new Schema({
    userId: {
        type: String,
        required: true,
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
    }, haveGroup: {
        type: Boolean,
        required: true
    }, frequency: {
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
    },builtIns: Array,
    data: {
        type: Object,
        required: true
    }
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
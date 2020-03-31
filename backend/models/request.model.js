const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requestSchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    }, typeRequest: {
        type: String,
        required: true
    }, data: Array,
    date: {
        type: Date,
        default: Date.now
    }
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request; 
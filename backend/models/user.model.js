const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true
    }, password: {
        type: String,
        required: true
    }, firstname: {
        type: String,
        required: true,
        trim: true
    }, lastname: {
        type: String,
        required: true,
        trim: true
    }, role: {
        type: String,
        enum: ["Admin", "Responder", "Researcher"],
        required: true,
    }, gender: String,
    job: String,
    recentProjects: Array,
    recentOtherSurveys: Array
});

const User = mongoose.model('User', userSchema);

module.exports = User;
const mongoose = require('mongoose')

const projectDetailsSchema = new mongoose.Schema({
    introduction: {
        type: String,
        trim: true,
        required: true
    },
    objectives: {
        type: String,
        trim: true,
        required: true
    },
    outcome: {
        type: String,
        trim: true,
        required: true
    },
    project_methodology: {
        type: String,
        trim: true,
        required: true
    },
    projectID: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})



const projectDetails = mongoose.model('projectDetails', projectDetailsSchema)
module.exports = projectDetails
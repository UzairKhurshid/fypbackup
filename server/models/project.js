const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    language: {
        type: String,
        trim: true,
        required: true
    },
    IDE: {
        type: String,
        trim: true,
        required: true
    },
    type: {
        type: String,
        trim: true,
        required: true
    },
    department: {
        type: String,
        trim: true,
        required: true
    },
    semester: {
        type: String,
        trim: true,
        required: true
    },
    year: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    ownerName: {
        type: String,
        trim: true
    },
    ownerEmail: {
        type: String,
        trim: true,
        ref: 'Account'
    },
    ownerRole: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    },
    request: {
        type: String,
        trim: true
    },
    assignedToID: {
        type: String,
        trim: true,
        ref: 'Account'
    }

}, {
    timestamps: true
})


projectSchema.virtual('requestProject', {
    ref: 'Request',
    localField: 'id',
    foreignField: 'projectID'
})


const Project = mongoose.model('Project', projectSchema)
module.exports = Project
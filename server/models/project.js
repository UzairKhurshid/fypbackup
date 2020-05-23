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
    season: {
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
    ownerID: {
        type: String,
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
    }

}, {
    timestamps: true
})


projectSchema.virtual('requestProject', {
    ref: 'Request',
    localField: '_id',
    foreignField: 'projectID'
})


const Project = mongoose.model('Project', projectSchema)
module.exports = Project
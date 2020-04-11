const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const requestSchema = new mongoose.Schema({

    projectID: {
        type: String,
        trim: true,
        required: true,
        ref: 'Project'
    },
    ownerEmail: {
        type: String,
        trim: true,
        required: true,
        ref: 'Account'
    },
    requestedByEmail: {
        type: String,
        trim: true,
        required: true,
        ref: 'Account'
    },
    requestedByRole: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        trim: true,
        required: true
    }
}, {
    timestamps: true
})


const Request = mongoose.model('Request', requestSchema)
module.exports = Request
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const myProjectSchema = new mongoose.Schema({

    ownerEmail: {
        type: String,
        trim: true,
        required: true,
        ref: 'Account'
    },
    projectID: {
        type: String,
        trim: true,
        required: true
    },
    requestedByEmail: {
        type: String,
        trim: true,
        required: true,
        ref: 'Account'
    },
    tasks: [{
        taskName: {
            type: String
        },
        taskDescription: {
            type: String
        },
        taskStartDate: {
            type: String
        },
        taskEndDate: {
            type: String
        },
        status: {
            type: String
        }
    }],
    chats: [{
        ownerEmail: {
            type: String
        },
        name: {
            type: String
        },
        msg: {
            type: String
        }
    }]

}, {
    timestamps: true
})



const myProject = mongoose.model('myProject', myProjectSchema)
module.exports = myProject
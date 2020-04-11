const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({

    projectID: {
        type: String,
        required: true
    },
    ownerEmail: {
        type: String,
        ref: 'Account'
    },
    requestedByEmail: {
        type: String
    },
    Chat: [{
        name: {
            type: String
        },
        msg: {
            type: String
        }
    }]
})

const Chat = mongoose.model('Chat', chatSchema)
module.exports = Chat
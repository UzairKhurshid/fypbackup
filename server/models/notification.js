const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({

    text: {
        type: String
    },
    ownerEmail: {
        type: String,
        ref: 'Account'
    },
    role: {
        type: String
    },
    date: {
        type: String,
        required: true
    },
    status: {
        type: String
    }


})

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification
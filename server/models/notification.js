const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({

    text: {
        type: String
    },
    refTable: {
        type: String,
        required: true
    },
    refRoute: {
        type: String,
        required: true
    },
    ownerID: {
        type: String,
        ref: 'Account'
    },
    role: {
        type: String
    },
    createdAt: {
        type: String,
        required: true
    },
    status: {
        type: String
    }
})

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification
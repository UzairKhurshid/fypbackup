const mongoose = require('mongoose')
const myProject = require('../models/myProject')

const generateMessage = (msg, name, email) => {
    return {
        msg,
        name,
        email,
        createdAt: new Date().getTime()
    }
}
const saveMessage = async(FYPID, ownerEmail, name, msg, createdAt) => {
    try {

        const proj = await myProject.findById({ _id: mongoose.Types.ObjectId(FYPID) })
        proj.chats = proj.chats.concat({ ownerEmail, name, msg, createdAt })
        await proj.save()

    } catch (e) {
        console.log(e.message)
    }
}

module.exports = {
    generateMessage,
    saveMessage
}
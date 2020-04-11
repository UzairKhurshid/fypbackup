const Account = require('../models/account')
const Notification = require('../models/notification')


const createNotification = async(text, ownerEmail, role) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const notification = new Notification()
    notification.text = text
    notification.ownerEmail = ownerEmail
    notification.role = role
    notification.date = date
    notification.status = 'unread'

    await notification.save()
}

const getAllNotifications = async(email, role) => {

    let i = 0
    let Arr = []
    let newObj = {
        txt: 'abc'
    }

    if (role == 'admin') {
        const noti = await Notification.find({ role: "admin" })
        for (i = 0; i < noti.length; i++) {
            let obj = Object.create(newObj)
            obj.txt = noti[i].text
            Arr[i] = obj
        }
    } else {
        const noti = await Notification.find({ ownerEmail: email })
        const noti2 = await Notification.find({ role: "" })
        if (!noti.length <= 0) {
            for (i = 0; i < noti.length; i++) {
                let obj = Object.create(newObj)
                obj.txt = noti[i].text
                Arr[i] = obj
            }
        }
        if (!noti2.length <= 0) {
            let j = Arr.length;
            for (i = 0; i < noti2.length; i++) {
                let obj = Object.create(newObj)
                obj.txt = noti2[i].text
                Arr[j] = obj
                j++
            }
        }
    }
    return Arr
}

module.exports = { createNotification, getAllNotifications }
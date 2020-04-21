const Account = require('../models/account')
const Notification = require('../models/notification')


const createNotification = async(text, refTable, refRoute, ownerEmail, role) => {
    const date = new Date()
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;


    const notification = new Notification()
    notification.text = text
    notification.refTable = refTable
    notification.refRoute = refRoute
    notification.ownerEmail = ownerEmail
    notification.role = role
    notification.createdAt = strTime
    notification.status = 'unread'

    await notification.save()
}

const getAllNotifications = async(email, role) => {

    let i = 0
    let Arr = []
    let newObj = {
        txt: 'abc',
        refTable: 'abc',
        refRoute: 'abc',
        createdAt: 'abc'
    }

    if (role == 'admin') {
        const noti = await Notification.find({ role: "admin" })
        for (i = 0; i < noti.length; i++) {
            let obj = Object.create(newObj)
            obj.txt = noti[i].text
            obj.refTable = noti[i].refTable
            obj.refRoute = noti[i].refRoute
            obj.createdAt = noti[i].createdAt
            Arr[i] = obj
        }
    } else {
        const noti = await Notification.find({ ownerEmail: email })
        const noti2 = await Notification.find({ role: "" })
        if (!noti.length <= 0) {
            for (i = 0; i < noti.length; i++) {
                let obj = Object.create(newObj)
                obj.txt = noti[i].text
                obj.refTable = noti[i].refTable
                obj.refRoute = noti[i].refRoute
                obj.createdAt = noti[i].createdAt
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
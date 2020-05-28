const Account = require('../models/account')
const Notification = require('../models/notification')
const mongoose = require('mongoose')


const createNotification = async(text, refTable, refRoute, ownerID, role) => {
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
    notification.ownerID = ownerID
    notification.role = role
    notification.time = strTime
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
        time: 'abc'
    }

    if (role == 'admin') {
        const noti = await Notification.find({ role: "admin" }).sort({ createdAt: -1 })
        for (i = 0; i < noti.length; i++) {
            let obj = Object.create(newObj)
            obj.txt = noti[i].text
            obj.refTable = noti[i].refTable
            obj.refRoute = noti[i].refRoute
            obj.time = noti[i].time
            Arr[i] = obj
        }
    } else {
        const account = await Account.findOne({ email, role })
        const id = account.id
        const noti = await Notification.find({ ownerID: id })
        const noti2 = await Notification.find({ role: "" })

        if (!noti.length <= 0) {
            for (i = 0; i < noti.length; i++) {
                let obj = Object.create(newObj)
                obj.txt = noti[i].text
                obj.refTable = noti[i].refTable
                obj.refRoute = noti[i].refRoute
                obj.time = noti[i].time
                Arr[i] = obj
            }
        }
        if (!noti2.length <= 0) {
            let j = Arr.length;
            for (i = 0; i < noti2.length; i++) {
                let obj = Object.create(newObj)
                obj.txt = noti2[i].text
                obj.refTable = noti2[i].refTable
                obj.refRoute = noti2[i].refRoute
                obj.time = noti2[i].time
                Arr[j] = obj
                j++
            }
        }
    }
    return Arr
}

module.exports = { createNotification, getAllNotifications }
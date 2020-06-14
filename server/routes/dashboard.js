const express = require('express')
const auth = require('../middleware/auth')
const Project = require('../models/project')
const Account = require('../models/account')
const Notification = require('../models/notification')
const { getAllNotifications } = require('../helpers/notification')
const { getAdminData, getTeacherData, getStudentData } = require('../helpers/dashboard')
const getArr = require('../helpers/supervisingFun')
const router = new express.Router()


router.get('/dashboard', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email
    try {

        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length
        if (role === "admin") {
            const adminData = await getAdminData(email, role)

            res.render('dashboard/index', {
                title: 'Admin Dashboard',
                adminLogin: 'true',
                Dashboard: true,
                notification: Arr,
                adminData: adminData,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } else if (role === "student") {
            const studentData = await getStudentData(email, role)

            console.log(studentData)

            res.render('dashboard/index', {
                title: 'Student Dashboard',
                studentLogin: 'true',
                Dashboard: true,
                studentData: studentData,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } else if (role === "teacher") {
            const teacherData = await getTeacherData(email, role)
            const acc = await Account.findOne({ email, role })
            const supervisingArr = await getArr(acc._id, role)
            const supervisingCount = supervisingArr.length


            res.render('dashboard/index', {
                title: 'Teacher Dashboard',
                teacherLogin: 'true',
                Dashboard: true,
                teacherData: teacherData,
                notification: Arr,
                notificationCount: notificationCount,
                supervisingCount: supervisingCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        }
    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }


})

router.post('/clearAllNotifications', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email
    try {
        const acc = await Account.findOne({ email, role })
        if (role == 'admin') {
            await Notification.deleteMany({ role: "admin" })
        } else {
            await Notification.deleteMany({ ownerID: acc._id })
        }


        req.flash('error', 'Notifications Cleared Succesfully')
        res.redirect('/dashboard')

    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})

module.exports = router
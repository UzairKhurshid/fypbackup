const express = require('express')
const auth = require('../middleware/auth')
const Project = require('../models/project')
const Notification = require('../models/notification')
const { getAllNotifications } = require('../helpers/notification')
const getArr = require('../helpers/supervisingFun')
const router = new express.Router()


router.get('/dashboard', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email
    try {
        const projects = await Project.find({ status: 'accepted' })
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length
        const supervisingArr = await getArr(email, role)
        const supervisingCount = supervisingArr.length

        if (role === "admin") {
            res.render('dashboard/index', {
                title: 'Admin Dashboard',
                adminLogin: 'true',
                Dashboard: true,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (role === "student") {
            res.render('dashboard/index', {
                title: 'Student Dashboard',
                studentLogin: 'true',
                Dashboard: true,
                project: projects,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (role === "teacher") {
            res.render('dashboard/index', {
                title: 'Teacher Dashboard',
                teacherLogin: 'true',
                Dashboard: true,
                project: projects,
                notification: Arr,
                notificationCount: notificationCount,
                supervisingCount: supervisingCount,
                accountName: req.session.name,
                success: req.flash('success')
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
        if (role == 'admin') {
            await Notification.deleteMany({ role: "admin" })
        } else {
            await Notification.deleteMany({ ownerEmail: email })
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
const express = require('express')
const auth = require('../middleware/auth')
const myProject = require('../models/myProject')
const Project = require('../models/project')
const Account = require('../models/account')
const getArr = require('../helpers/supervisingFun')
const mongoose = require('mongoose')
const { getAllNotifications } = require('../helpers/notification')


const router = new express.Router()


router.get('/chat', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email

    try {
        const notificationArr = await getAllNotifications(email, role)
        const notificationCount = notificationArr.length
        const acc = await Account.findOne({ email: email, role: role })

        if (role == 'teacher') {

            const Arr = await getArr(acc._id, role)

            res.render('chatroom/ali_chat', {
                title: 'Chat Room',
                teacherLogin: 'true',
                projectList: Arr,
                notification: notificationArr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } else if (role == 'student') {

            const myprojects = await myProject.findOne({ requestedByID: acc._id })
            const id = myprojects.projectID
            const project = await Project.findOne({ _id: id })

            res.render('chatroom/ali_chat', {
                title: 'Chat Room',
                studentLogin: 'true',
                projectList: project,
                FYPID: id,
                notification: notificationArr,
                notificationCount: notificationCount,
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

router.get('/chat/:id', auth, async(req, res) => {
    const email = req.session.email
    const role = req.session.role
    const FYPID = req.params.id
    const projectName = req.query.projectName || ''

    try {
        const notificationArr = await getAllNotifications(email, role)
        const notificationCount = notificationArr.length
        const acc = await Account.findOne({ email: email, role: role })

        if (role == 'teacher') {
            const Arr = await getArr(acc._id, role)
            const proj = await myProject.findOne({ _id: mongoose.Types.ObjectId(FYPID) })

            res.render('chatroom/ali_chat', {
                title: 'Chat Room',
                teacherLogin: 'true',
                projectList: Arr,
                chats: proj.chats,
                FYPID: FYPID,
                projectName: projectName,
                email: email,
                notification: notificationArr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } else if (role == 'student') {
            const myprojects = await myProject.findOne({ requestedByID: acc._id })
            const id = myprojects.projectID
            const project = await Project.findOne({ _id: id })

            res.render('chatroom/ali_chat', {
                title: 'Chat Room',
                studentLogin: 'true',
                projectList: project,
                chats: myprojects.chats,
                FYPID: FYPID,
                projectName: projectName,
                email: email,
                notification: notificationArr,
                notificationCount: notificationCount,
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






module.exports = router
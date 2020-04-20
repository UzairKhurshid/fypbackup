const express = require('express')
const auth = require('../middleware/auth')
const myProject = require('../models/myProject')
const Project = require('../models/project')
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

        if (role == 'teacher') {
            const Arr = await getArr(email, role)

            res.render('chatroom/ali_chat', {
                title: 'Chat Room',
                teacherLogin: 'true',
                projectList: Arr,
                notification: notificationArr,
                notificationCount: notificationCount,
                accountName: req.session.name,
            })
        } else if (role == 'student') {
            const myprojects = await myProject.findOne({ requestedByEmail: email })
            const id = myprojects.projectID
            const project = await Project.findOne({ _id: id })

            res.render('chatroom/ali_chat', {
                title: 'Chat Room',
                studentLogin: 'true',
                projectList: project,
                FYPID: id,
                notification: notificationArr,
                notificationCount: notificationCount,
                accountName: req.session.name,
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

    // chat/5e9d7ec21a652412ec4f7ec0?projectName=School Managment System
    //ObjectId
    try {
        const notificationArr = await getAllNotifications(email, role)
        const notificationCount = notificationArr.length

        if (role == 'teacher') {
            const Arr = await getArr(email, role)
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
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (role == 'student') {
            const myprojects = await myProject.findOne({ requestedByEmail: email })
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






module.exports = router
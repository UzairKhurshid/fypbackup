const express = require('express')
const auth = require('../middleware/auth')
const myProject = require('../models/myProject')
const { getAllNotifications } = require('../helpers/notification')


const router = new express.Router()


router.get('/chat', auth, async(req, res) => {
    try {
        res.render('chatroom/ali_chat', {
            title: 'Chat Room',
            teacherLogin: 'true',
            accountName: req.session.name,
        })
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
        const proj = await myProject.findOne({ _id: FYPID })
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length

        if (role == 'teacher') {
            res.render('chatroom/chat', {
                title: 'Chat Room',
                teacherLogin: 'true',
                chats: proj.chats,
                FYPID: FYPID,
                projectName: projectName,
                notification: Arr,
                notificationCount: notificationCount,
                email: email,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (role == 'student') {
            res.render('chatroom/chat', {
                title: 'Chat Room',
                studentLogin: 'true',
                chats: proj.chats,
                FYPID: FYPID,
                projectName: projectName,
                notification: Arr,
                notificationCount: notificationCount,
                email: email,
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

router.post('/chat', auth, async(req, res) => {
    const FYPID = req.body.FYPID
    const projectName = req.body.projectName

    try {

        const proj = await myProject.findOne({ _id: FYPID })

        const name = req.session.name
        const msg = req.body.txtMsg
        const ownerEmail = req.session.email

        proj.chats = proj.chats.concat({ ownerEmail, name, msg })
        await proj.save()

        res.redirect('/chat/' + FYPID + '?projectName=' + projectName)
    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})





module.exports = router
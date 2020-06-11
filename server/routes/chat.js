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

            let id = ""
            let project = []
            if (myprojects == null) {
                studentAccID = acc._id

                let flag = 'false'
                const myProj = await myProject.find({})
                if (myProj === undefined || myProj.length == 0) {} else {
                    myProj.forEach(proj => {
                        var members = proj.members
                        if (members === undefined || members.length == 0) {} else {
                            members.forEach(mem => {
                                if (mem.accID == acc._id) {
                                    flag = 'true'
                                }
                            });
                        }
                    });
                }
                if (flag == 'true') {
                    project = myProj
                    id = myProj[0].projectID
                    project = await Project.findOne({ _id: id })
                }

            } else {
                id = myprojects.projectID
                project = await Project.findOne({ _id: id })
            }

            res.render('chatroom/ali_chat', {
                title: 'Chat Room',
                studentLogin: 'true',
                projectList: project,
                FYPID: id,
                notification: notificationArr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                currentEmail:email,
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

            proj.chats.forEach(element => {
                element.ownerEmail = element.ownerEmail.substring(0,element.ownerEmail.indexOf( "@"))
            });
            // console.log(proj.chats)
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
                currentEmail:email.substring(0,email.indexOf( "@")),
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } else if (role == 'student') {
            const myprojects = await myProject.findOne({ _id: mongoose.Types.ObjectId(FYPID) })
            console.log(myprojects)
            const id = myprojects.projectID
            const project = await Project.findOne({ _id: id })


            res.render('chatroom/ali_chat', {
                title: 'Chat Room',
                studentLogin: 'true',
                projectList: project,
                chats: myprojects.chats,
                FYPID: FYPID,
                projectName: project.name,
                email: email,
                currentEmail:email.substring(0,email.indexOf( "@")),
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
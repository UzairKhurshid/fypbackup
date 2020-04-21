const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Project = require('../models/project')
const Account = require('../models/account')
const myProject = require('../models/myProject')
const { createNotification, getAllNotifications } = require('../helpers/notification')
const getArr = require('../helpers/supervisingFun')




router.get('/myProject', async(req, res) => {

    const role = req.session.role
    const email = req.session.email

    try {

        if (role == 'student') {
            const account = await Account.findOne({ email, role })
            if (!account) {
                return res.redirect('/dashboard')
            }

            await account.populate('myProjectRequestedByEmail').execPopulate()
            const project = await Project.findOne({ _id: account.myProjectRequestedByEmail[0].projectID })
            const supervisor = await Account.findOne({ email: account.myProjectRequestedByEmail[0].ownerEmail })
            const Arr = await getAllNotifications(email, role)
            const notificationCount = Arr.length

            res.render('projects/myProject', {
                title: 'FYP',
                Projects: true,
                studentLogin: 'true',
                project: account.myProjectRequestedByEmail,
                projName: project.name,
                supName: supervisor.name,
                notification: Arr,
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



router.get('/supervising', async(req, res) => {

    const role = req.session.role
    const email = req.session.email

    try {

        if (role == 'teacher') {
            const Arr = await getArr(email, role)
            const notificationArr = await getAllNotifications(email, role)
            const notificationCount = notificationArr.length

            res.render('projects/supervising', {
                title: 'Supervising',
                Projects: true,
                teacherLogin: 'true',
                obj: Arr,
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



router.get('/FYPTasks/:id', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email
    const id = req.params.id

    try {

        const proj = await myProject.findOne({ _id: id })
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length

        if (role == 'student') {

            res.render('projects/FYPTasks', {
                title: 'FYP Tasks',
                studentLogin: true,
                projID: proj.id,
                tasks: proj.tasks,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (role == 'teacher') {

            res.render('projects/FYPTasks', {
                title: 'FYP Tasks',
                teacherLogin: true,
                projID: proj.id,
                tasks: proj.tasks,
                notification: Arr,
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


router.get('/FYP/newTask/:id', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email
    const id = req.params.id
    try {
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length

        if (role == 'teacher') {
            res.render('projects/FYPNewTask', {
                title: 'FYP New Task',
                teacherLogin: true,
                projID: id,
                notification: Arr,
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


router.post('/FYP/newTask/:id', async(req, res) => {

    const id = req.params.id
    try {
        const proj = await myProject.findOne({ _id: id })

        const taskName = req.body.taskName
        const taskDescription = req.body.taskDescription
        const taskStartDate = req.body.taskStartDate
        const taskEndDate = req.body.taskEndDate
        const status = req.body.status


        proj.tasks = proj.tasks.concat({ taskName, taskDescription, taskStartDate, taskEndDate, status })
        await proj.save()
        await createNotification('Your have a new Task . please review Your FYP tasks .', 'Task', '/FYPTasks/' + id, proj.requestedByEmail, 'student')

        req.flash('success', 'Successfully Created New Task For FYP')
        res.redirect('/FYPTasks/' + id)
    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})

router.post('/FYP/markTaskCompleted/:id', auth, async(req, res) => {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const id = req.params.id
    const taskID = req.body.taskID
    let i = 0

    try {
        const proj = await myProject.findOne({ _id: id })
        for (i = 0; i < proj.tasks.length; i++) {
            if (proj.tasks[i]._id == taskID) {
                proj.tasks[i].status = 'complete'
                await proj.save()
            }
        }
        //Creating Notification
        await createNotification('Your Task is marked Completed . please review Your FYP Progress .', 'Task', '/FYPTasks/' + id, proj.requestedByEmail, 'student')

        req.flash('success', 'Status Changed Successfully')
        res.redirect('/FYPTasks/' + id)

    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/FYPTasks/' + id)
    }

})


module.exports = router
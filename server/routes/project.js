const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Project = require('../models/project')
const Account = require('../models/account')
const { createNotification, getAllNotifications } = require('../helpers/notification')

router.get('/projects', auth, async(req, res) => {

    const email = req.session.email
    const role = req.session.role

    try {
        const proj = await Project.find({ status: 'accepted' })
        const projects = await Project.find({ status: 'accepted' }).sort({ year: -1, name: 'asc' })
        const count = Object.keys(proj).length
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length

        if (role == 'admin') {
            res.render('projects/index', {
                title: 'Projects',
                Projects: true,
                adminLogin: 'true',
                project: projects,
                count: count,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (role == 'student') {
            res.render('projects/index', {
                title: 'Projects',
                Projects: true,
                studentLogin: 'true',
                project: projects,
                count: count,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (role == 'teacher') {
            res.render('projects/index', {
                title: 'Projects',
                Projects: true,
                teacherLogin: 'true',
                project: projects,
                count: count,
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
router.get('/admin/proposedProjects', auth, async(req, res) => {

    const role = req.session.role
    const email = req.session.email

    try {
        const proj = await Project.find({ status: 'proposed' })
        const projects = await Project.find({ status: 'proposed' }).sort({ year: -1, name: 'asc' })
        const count = Object.keys(proj).length
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length

        res.render('projects/index', {
            title: 'Proposed Projects',
            proposeProjects: true,
            adminLogin: 'true',
            project: projects,
            count: count,
            notification: Arr,
            notificationCount: notificationCount,
            accountName: req.session.name,
            success: req.flash('success')
        })
    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})



router.get('/projects/create', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email
    const Arr = await getAllNotifications(email, role)
    const notificationCount = Arr.length

    if (role == 'admin') {
        res.render('projects/create', {
            title: 'Create Project',
            adminLogin: 'true',
            Projects: true,
            notification: Arr,
            notificationCount: notificationCount,
            accountName: req.session.name
        })
    } else if (role == 'student') {
        res.render('projects/create', {
            title: 'Create Project',
            studentLogin: 'true',
            Projects: true,
            notification: Arr,
            notificationCount: notificationCount,
            accountName: req.session.name
        })
    } else if (role == 'teacher') {
        res.render('projects/create', {
            title: 'Create Project',
            teacherLogin: 'true',
            Projects: true,
            notification: Arr,
            notificationCount: notificationCount,
            accountName: req.session.name
        })
    }
})

router.post('/projects/create', auth, async(req, res) => {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const role = req.session.role
    const project = new Project(req.body)
    project.ownerRole = role
    project.status = 'accepted'

    try {
        //Creating Notification
        await project.save()
        await createNotification('A new Project is added . please review Projects .', 'Project', '/projects', '', '')

        req.flash('success', 'Projectd Created Successfully')
        res.redirect('/projects')
    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})




router.get('/projects/update/:id', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email

    try {
        const id = req.params.id
        const prj = await Project.findOne({ _id: id })
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length

        if (role == 'admin') {
            res.render('projects/update', {
                title: 'Update Project',
                Projects: true,
                adminLogin: 'true',
                project: prj,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (role == 'teacher') {
            res.render('projects/update', {
                title: 'Update Project',
                Projects: true,
                teacherLogin: 'true',
                project: prj,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (role == 'student') {
            res.render('projects/update', {
                title: 'Update Project',
                Projects: true,
                studentLogin: 'true',
                project: prj,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                success: req.flash('success')
            })
        }

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})

router.post('/projects/update/:id', auth, async(req, res) => {

    const updates = Object.keys(req.body)

    const id = req.params.id

    try {

        const project = await Project.findOne({ _id: id })
        updates.forEach((update) => project[update] = req.body[update])
        await project.save()

        console.log("Updated SUccessfully")
        req.flash('success', 'Project Updated Successfully')
        res.redirect('/projects')
    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})


router.post('/projects/delete/:id', auth, async(req, res) => {

    const id = req.params.id

    try {
        await Project.findOneAndDelete({ _id: id })
        console.log("deleted Successfully")
        req.flash('success', 'Project deleted successfully')
        res.redirect('/projects')
    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})




router.get('/viewproject/:id', auth, async(req, res) => {
    const id = req.params.id
    const role = req.session.role
    const email = req.session.email
    try {

        const proj = await Project.findOne({ _id: id })
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length

        if (role == 'admin') {
            res.render('projects/viewproject', {
                title: 'View Project',
                Projects: true,
                adminLogin: 'true',
                project: proj,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (role == 'student') {
            res.render('projects/viewproject', {
                title: 'View Project',
                Projects: true,
                studentLogin: 'true',
                project: proj,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (role == 'teacher') {
            res.render('projects/viewproject', {
                title: 'View Project',
                Projects: true,
                teacherLogin: 'true',
                project: proj,
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


module.exports = router
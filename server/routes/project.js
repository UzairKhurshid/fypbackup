const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Project = require('../models/project')
const projectDetails = require('../models/projectDetails')
const Account = require('../models/account')
const Request = require('../models/request')
const myProject = require('../models/myProject')
const { createNotification, getAllNotifications } = require('../helpers/notification')
const checkSimilarity = require('../helpers/cosuine _similarity')


// can accept request from notification if limit reached .
// cannot propose a project if member of any project
router.get('/projects', auth, async(req, res) => {

    const email = req.session.email
    const role = req.session.role
    let projects = []
    let count = 2
    try {
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length
        if (req.query.season) {
            const season = req.query.season
            const proj = await Project.find({ status: 'accepted' })
            projects = await Project.find({ status: 'accepted', season }).sort({ year: 1, name: 'asc' })
            count = Object.keys(proj).length
        } else {
            const proj = await Project.find({ status: 'accepted' })
            projects = await Project.find({ status: 'accepted' }).sort({ year: -1, name: 'asc' })
            count = Object.keys(proj).length
        }


        if (role == 'admin') {
            res.render('projects/index', {
                title: 'Projects',
                Projects: true,
                adminLogin: 'true',
                project: projects,
                count: count,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
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
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
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

router.get('/admin/proposedProjects', auth, async(req, res) => {

    const role = req.session.role
    const email = req.session.email
    let projects = []
    let count = 2

    try {
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length
        if (req.query.season) {
            const season = req.query.season
            const proj = await Project.find({ status: 'proposed' })
            projects = await Project.find({ status: 'proposed', season }).sort({ year: -1, name: 'asc' })
            count = Object.keys(proj).length
        } else {
            const proj = await Project.find({ status: 'proposed' })
            projects = await Project.find({ status: 'proposed' }).sort({ year: -1, name: 'asc' })
            count = Object.keys(proj).length
        }


        res.render('projects/index', {
            title: 'Proposed Projects',
            proposeProjects: true,
            adminLogin: 'true',
            project: projects,
            count: count,
            notification: Arr,
            notificationCount: notificationCount,
            accAvatar: req.session.avatar,
            accountName: req.session.name,
            success: req.flash('success'),
            error: req.flash('error')
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
            accAvatar: req.session.avatar,
            accountName: req.session.name,
            success: req.flash('success'),
            error: req.flash('error')
        })
    } else if (role == 'student') {
        res.render('projects/create', {
            title: 'Create Project',
            studentLogin: 'true',
            Projects: true,
            notification: Arr,
            notificationCount: notificationCount,
            accAvatar: req.session.avatar,
            accountName: req.session.name,
            success: req.flash('success'),
            error: req.flash('error')
        })
    } else if (role == 'teacher') {
        res.render('projects/create', {
            title: 'Create Project',
            teacherLogin: 'true',
            Projects: true,
            notification: Arr,
            notificationCount: notificationCount,
            accAvatar: req.session.avatar,
            accountName: req.session.name,
            success: req.flash('success'),
            error: req.flash('error')
        })
    }
})

router.post('/projects/create', auth, async(req, res) => {
    const role = req.session.role

    try {

        console.log(req.file.originalname)
        return res.redirect('/projects')
        const project = new Project(req.body)

        project.ownerRole = role
        project.status = 'accepted'
        proj = await project.save();
        //console.log(proj._id)

        //creating project details
        const projectDet = new projectDetails(req.body)
        projectDet.projectID = proj._id
        await projectDet.save()
            //Creating Notification
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
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } else if (role == 'teacher') {
            res.render('projects/update', {
                title: 'Update Project',
                Projects: true,
                teacherLogin: 'true',
                project: prj,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } else if (role == 'student') {
            res.render('projects/update', {
                title: 'Update Project',
                Projects: true,
                studentLogin: 'true',
                project: prj,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        }

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})

router.post('/projects/update/:id', auth, async(req, res) => {
    const role = req.session.role
    const updates = Object.keys(req.body)
    const id = req.params.id

    try {

        const project = await Project.findOne({ _id: id })
        updates.forEach((update) => project[update] = req.body[update])
        await project.save()

        console.log("Updated SUccessfully")
        req.flash('success', 'Project Updated Successfully')
        if (role == 'admin') {
            return res.redirect('/projects')
        }
        return res.redirect('/selfProposed')

    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})

router.post('/projects/delete/:id', auth, async(req, res) => {
    const role = req.session.role
    const id = req.params.id

    try {
        await Project.findOneAndDelete({ _id: id })
        await projectDetails.findOneAndDelete({ projectID: id })
        await Request.findOneAndDelete({ projectID: id })
        await myProject.findOneAndDelete({ projectID: id })


        console.log("deleted Successfully")
        req.flash('success', 'Project deleted successfully')
        if (role == 'admin') {
            return res.redirect('/projects')
        }
        return res.redirect('/selfProposed')
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
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } else if (role == 'student') {
            res.render('projects/viewproject', {
                title: 'View Project',
                Projects: true,
                studentLogin: 'true',
                project: proj,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } else if (role == 'teacher') {
            res.render('projects/viewproject', {
                title: 'View Project',
                Projects: true,
                teacherLogin: 'true',
                project: proj,
                notification: Arr,
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


router.post('/project/verify', auth, async(req, res) => {
    try {
        // console.log("BOdy"+req.body.docx)
        let projects = []
        projects = await projectDetails.find({});

        if (projects.length <= 0) {
            res.json({
                success: true,
                verify: true
            })
        }

        detected = []

        projects.forEach(proj => {

            // Checking Title
            titleScore = checkSimilarity(req.body.docx.title, proj.title)
                //Checking Introduction
            introductionScore = checkSimilarity(req.body.docx.introduction, proj.introduction)
                //Checking Objectives
            objectivesScore = checkSimilarity(req.body.docx.objectives, proj.objectives)
                //  Checking outcome
            outcomeScore = checkSimilarity(req.body.docx.outcome, proj.outcome)

            averageScore = (((titleScore + introductionScore + objectivesScore + outcomeScore) / 4) * 100)

            if (averageScore >= 70) {
                detected.push(proj.projectID)
            }

        });
        const detectedProject = await Project.findOne({ _id: detected })
        console.log(detectedProject)
            // console.log("projects_Details "+projects.length)

        if (detected.length > -1) {

            res.json({
                success: true,
                verify: false
            })
        }

        res.json({
            success: true,
            verify: true
        })
    } catch (e) {
        console.log(e.message)
            // req.flash('error', e.message)
        res.json({
            success: false,
            verify: false
        })
    }
})


module.exports = router
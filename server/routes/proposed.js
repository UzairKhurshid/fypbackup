const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Project = require('../models/project')
const Account = require('../models/account')
const Request = require('../models/request')
const myProject = require('../models/myProject')
const { createNotification, getAllNotifications } = require('../helpers/notification')
const getArr = require('../helpers/requestFun')
const { sendWelcomeMail, sendActivationMail, sendDeActivationMail, sendProjectAcceptanceMail, sendProjectRequestMail } = require('../emailSender/email')





router.get('/proposed/allProposedProjects', auth, async(req, res) => {

    const email = req.session.email
    const role = req.session.role
    try {
        const proj = await Project.find({ ownerRole: 'teacher', status: 'proposed' })
        const projects = await Project.find({ ownerRole: 'teacher', status: 'proposed' }).sort({ year: -1, name: 'asc' })
        const count = Object.keys(proj).length
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length

        if (role == "student") {

            return res.render('proposed/allProposedProjects', {
                title: 'Proposed Projects',
                Projects: true,
                studentLogin: true,
                project: projects,
                count: count,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                success: req.flash('success')
            })

        } else if (role == "teacher") {

            return res.render('proposed/allProposedProjects', {
                title: 'Proposed Projects',
                Projects: true,
                teacherLogin: true,
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



router.get('/selfProposed', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email
    try {
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length

        if (role == 'student') {
            const account = await Account.findOne({ email })

            if (!account) {
                return res.redirect('/dashboard')
            }

            await account.populate('projects').execPopulate()

            return res.render('proposed/selfproposedProjects', {
                title: 'Self Proposed',
                Projects: true,
                studentLogin: 'true',
                project: account.projects,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (role == 'teacher') {
            const account = await Account.findOne({ email })

            if (!account) {
                return res.redirect('/dashboard')
            }

            await account.populate('projects').execPopulate()

            return res.render('proposed/selfproposedProjects', {
                title: 'self Proposed',
                Projects: true,
                teacherLogin: 'true',
                project: account.projects,
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



router.get('/proposed/proposeNewProject', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email
    try {
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length
        if (role == "student") {

            const account = await Account.findOne({ email })
            if (!account) {
                return res.redirect('/dashboard')
            }

            return res.render('proposed/proposeNewProject', {
                title: 'Propose New Project',
                studentLogin: 'true',
                Projects: true,
                ownerName: account.name,
                ownerEmail: account.email,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                ownerRole: role
            })

        } else if (role == "teacher") {

            const account = await Account.findOne({ email })
            if (!account) {
                return res.redirect('/dashboard')
            }

            return res.render('proposed/proposeNewProject', {
                title: 'Propose New Project',
                teacherLogin: 'true',
                Projects: true,
                ownerName: account.name,
                ownerEmail: account.email,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                ownerRole: role
            })
        }
    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }

})

router.post('/proposed/proposeNewProject', auth, async(req, res) => {


    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const project = new Project(req.body)
    const role = req.session.role

    project.ownerRole = role
    project.status = 'proposed'

    try {

        await project.save()
        await createNotification('A new Project is Proposed by ' + req.session.name + ' ( ' + role + '). Have a look in proposed Projects.', '', '')

        console.log("project saves successfully")
        req.flash('success', 'Projectd Created Successfully')
        res.redirect('/proposed/allProposedProjects')
    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})


router.get('/projects/requests', async(req, res) => {

    const role = req.session.role
    const email = req.session.email


    try {
        const Arr = await getArr(email, role)
        const notificationArr = await getAllNotifications(email, role)
        const notificationCount = notificationArr.length

        if (role == 'student') {


            return res.render('proposed/requests', {
                title: 'Project Requests',
                Projects: true,
                studentLogin: 'true',
                obj: Arr,
                notification: notificationArr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (role == 'teacher') {

            return res.render('proposed/requests', {
                title: 'Requested Projects',
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


router.post('/projects/deleteRequest/:id', async(req, res) => {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const id = req.params.id
    try {


        await Request.findByIdAndDelete(id)
        await createNotification('Your request to project is deleted . please review Your requests .', req.body.requestedByEmail, 'student')

        req.flash('success', 'Request Cancelled')
        res.redirect('/projects/requests')

    } catch (e) {
        console.log(e.message)
        req.flash('error', 'something went wrong please try again')
        res.redirect('/dashboard')
    }

})

router.post('/projects/acceptRequest/:id', async(req, res) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const email = req.body.requestedByEmail
    const role = req.session.role
    const id = req.params.id

    try {

        if (role == 'teacher') {
            const account = await Account.findOne({ email, role: 'student' })
            if (!account) {
                return res.redirect('/dashboard')
            }

            await account.populate('myProjectRequestedByEmail').execPopulate()

            if (Object.entries(account.myProjectRequestedByEmail).length !== 0) {
                req.flash('success', 'Project Assignation Failed . Student Already Working on a project')
                return res.redirect('/projects/requests')
            }


            const myProj = new myProject(req.body)
            await myProj.save()
            await Request.findByIdAndDelete(id)

            const projectID = req.body.projectID
            var query = { _id: projectID }
            await Project.findOneAndUpdate(query, { status: 'accepted' })
            sendProjectAcceptanceMail(req.session.email)
            await createNotification('Your request to project is Accepted by ' + req.session.name + '  . please review Your FYP Now .', req.body.requestedByEmail, 'student')


            req.flash('success', 'Successfull , You are supervising this project from now on ...')
            res.redirect('/supervising')
        }

    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/projects/requests')
    }

})


router.post('/projects/requestProject/:id', auth, async(req, res) => {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const request = new Request(req.body)
    request.projectID = req.params.id
    request.requestedByEmail = req.session.email
    request.requestedByRole = req.session.role
    request.status = 'requested'

    try {
        const prevReq = await Request.find({ projectID: req.params.id })

        if (!prevReq.length <= 0) {
            throw new Error('Already requested for this project')
        }
        await request.save()
        sendProjectRequestMail(req.session.email)
        await createNotification('Your have a new request by ' + req.session.name + '  . please review Your requests .', req.body.ownerEmail, 'teacher')

        req.flash('success', 'Request for this Project is sent Successfully')
        res.redirect('/projects/requests')

    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }

})


module.exports = router
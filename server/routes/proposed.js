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
                accAvatar: req.session.avatar,
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
                accAvatar: req.session.avatar,
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
            const account = await Account.findOne({ email, role })
            await account.populate('projects').execPopulate()

            return res.render('proposed/selfproposedProjects', {
                title: 'Self Proposed',
                Projects: true,
                studentLogin: 'true',
                project: account.projects,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (role == 'teacher') {
            const account = await Account.findOne({ email, role })
            await account.populate('projects').execPopulate()

            return res.render('proposed/selfproposedProjects', {
                title: 'self Proposed',
                Projects: true,
                teacherLogin: 'true',
                project: account.projects,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
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

            const account = await Account.findOne({ email, role })
            return res.render('proposed/proposeNewProject', {
                title: 'Propose New Project',
                studentLogin: 'true',
                Projects: true,
                ownerName: account.name,
                ownerID: account.id,
                ownerRole: role,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name
            })

        } else if (role == "teacher") {

            const account = await Account.findOne({ email, role })
            return res.render('proposed/proposeNewProject', {
                title: 'Propose New Project',
                teacherLogin: 'true',
                Projects: true,
                ownerName: account.name,
                ownerID: account.id,
                ownerRole: role,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name
            })
        }
    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }

})

router.post('/proposed/proposeNewProject', auth, async(req, res) => {
    try {
        const project = new Project(req.body)
        project.status = 'proposed'
        await project.save()
        await createNotification('A new Project is Proposed by ' + req.session.name + ' ( ' + req.session.role + '). please review proposed Projects.', 'Project', '/proposed/allProposedProjects', '', '')

        console.log("project saves successfully")
        req.flash('success', 'Projectd Created Successfully')
        res.redirect('/selfProposed')
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
                accAvatar: req.session.avatar,
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
                accAvatar: req.session.avatar,
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
    const id = req.params.id
    try {
        const acc = await Account.findOne({ email: req.body.requestedByEmail })
        const accID = acc.id
        await Request.findByIdAndDelete(id)
        await createNotification('Your request to project is deleted . please review Your requests .', 'Request', '/projects/requests', accID, 'student')

        req.flash('success', 'Request Cancelled')
        res.redirect('/projects/requests')
    } catch (e) {
        console.log(e.message)
        req.flash('error', 'something went wrong please try again')
        res.redirect('/dashboard')
    }

})

router.post('/projects/acceptRequest/:id', async(req, res) => {
    const email = req.body.requestedByEmail
    const role = req.session.role
    const id = req.params.id

    try {

        if (role == 'teacher') {
            const account = await Account.findOne({ email, role: 'student' })
            await account.populate('myProjectRequestedByID').execPopulate()
            if (Object.entries(account.myProjectRequestedByID).length !== 0) {
                req.flash('success', 'Project Assignation Failed . Student Already Working on a project')
                return res.redirect('/projects/requests')
            }
            const ownerEmail = req.body.ownerEmail
            const requestedByEmail = req.body.requestedByEmail
            const ownerAcc = await Account.findOne({ email: ownerEmail, role: 'teacher' })
            const requestedbyAcc = await Account.findOne({ email: requestedByEmail, role: 'student' })
            const myProj = new myProject()
            myProj.projectID = req.body.projectID
            myProj.ownerID = ownerAcc.id
            myProj.requestedByID = requestedbyAcc.id
            await myProj.save()
            await Request.findByIdAndDelete(id)

            const projectID = req.body.projectID
            var query = { _id: projectID }
            await Project.findOneAndUpdate(query, { status: 'accepted' })
            sendProjectAcceptanceMail(req.session.email)
            await createNotification('Your request to project is Accepted by ' + req.session.name + '  . please review Your FYP Now .', 'Request', '/myProject', requestedbyAcc.id, 'student')

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
    const role = req.session.role
    const email = req.session.email
    try {
        const account = await Account.findOne({ email, role })
        const request = new Request()
        request.ownerID = req.body.ownerID
        request.projectID = req.params.id
        request.requestedByID = account.id
        request.requestedByRole = account.role
        request.status = 'requested'

        const prevReq = await Request.find({ projectID: req.params.id })
        if (!prevReq.length <= 0) {
            throw new Error('Already requested for this project')
        }
        await request.save()
        sendProjectRequestMail(req.session.email)
        await createNotification('You have a new request by ' + req.session.name + '  . please review Your requests .', 'Request', '/projects/requests', req.body.ownerID, 'teacher')

        req.flash('success', 'Request for this Project is sent Successfully')
        res.redirect('/projects/requests')

    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }

})


module.exports = router
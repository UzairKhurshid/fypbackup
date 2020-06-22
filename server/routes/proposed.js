const express = require('express')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const router = new express.Router()
const Project = require('../models/project')
const Account = require('../models/account')
const Request = require('../models/request')
const myProject = require('../models/myProject')
const projectDetails = require('../models/projectDetails')
const { createNotification, getAllNotifications } = require('../helpers/notification')
const getArr = require('../helpers/requestFun')
const { sendWelcomeMail, sendActivationMail, sendDeActivationMail, sendProjectAcceptanceMail, sendProjectRequestMail } = require('../emailSender/email')





router.get('/proposed/allProposedProjects', auth, async(req, res) => {

    const email = req.session.email
    const role = req.session.role
    let projects = []
    let count = 2

    try {
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length
        if (req.query.season) {
            const season = req.query.season
            const proj = await Project.find({ ownerRole: 'teacher', status: 'proposed' })
            projects = await Project.find({ ownerRole: 'teacher', status: 'proposed', season }).sort({ year: -1, name: 'asc' })
            count = Object.keys(proj).length
        } else {
            const proj = await Project.find({ ownerRole: 'teacher', status: 'proposed' })
            projects = await Project.find({ ownerRole: 'teacher', status: 'proposed' }).sort({ year: -1, name: 'asc' })
            count = Object.keys(proj).length
        }


        if (role == "student") {

            return res.render('proposed/all_proposed_projects', {
                title: 'Proposed Projects',
                Projects: true,
                studentLogin: true,
                project: projects,
                count: count,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })

        } else if (role == "teacher") {

            return res.render('proposed/all_proposed_projects', {
                title: 'Proposed Projects',
                Projects: true,
                teacherLogin: true,
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



router.get('/selfProposed', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email
    try {
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length

        if (role == 'student') {
            const account = await Account.findOne({ email, role })
            const accID = account._id
            const projs = await Project.find({ ownerID: accID })


            return res.render('proposed/self_proposed_projects', {
                title: 'Self Proposed',
                Projects: true,
                studentLogin: 'true',
                project: projs,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } else if (role == 'teacher') {
            const account = await Account.findOne({ email, role })
            await account.populate('projects').execPopulate()

            return res.render('proposed/self_proposed_projects', {
                title: 'self Proposed',
                Projects: true,
                teacherLogin: 'true',
                project: account.projects,
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



router.get('/proposed/proposeNewProject', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email
    try {
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length
        if (role == "student") {

            const account = await Account.findOne({ email, role })
            const teachers = await Account.find({ role: 'teacher' })
            return res.render('proposed/proposeNewProject', {
                title: 'Propose New Project',
                studentLogin: 'true',
                Projects: true,
                teachers: teachers,
                ownerName: account.name,
                ownerID: account.id,
                ownerRole: role,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
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

router.post('/proposed/proposeNewProject', auth, async(req, res) => {
    const email = req.session.email
    const role = req.session.role
    try {
        if (role == 'student') {

            //checking student already working on a project or not  
            const account = await Account.findOne({ email, role })
            studentAccID = account._id
            await account.populate('myProjectRequestedByID').execPopulate()

            if (account.myProjectRequestedByID === undefined || account.myProjectRequestedByID.length == 0) {
                let flag = 'false'
                const myProj = await myProject.find({})
                if (myProj === undefined || myProj == 0) {} else {
                    myProj.forEach(proj => {
                        var members = proj.members
                        if (members === undefined || members.length == 0) {} else {
                            members.forEach(mem => {
                                if (mem.accID == account._id) {
                                    flag = 'true'
                                }
                            });
                        }
                    });
                }
                if (flag == 'true') {
                    req.flash('error', 'Failed .Cannot propose project when Already Working on a project ')
                    return res.redirect('/selfProposed')
                }
            }
            if (Object.entries(account.myProjectRequestedByID).length !== 0) {
                req.flash('error', 'Failed .Cannot propose project when Already Working on a project ')
                return res.redirect('/selfProposed')
            }

            //checking teacher exists or not
            const teacherRegNo = req.body.teacherRegNo
            const teacherAcc = await Account.findOne({ regNo: teacherRegNo })
            const teacherAccID = teacherAcc._id
            if (!teacherAcc) {
                throw new Error('Teacher With this Registeration No doesnt Exists.')
            }

            //creating project
            const projYear = req.body.year
            const todaysDate = new Date()
            const currentYear = todaysDate.getFullYear()
            if (projYear < currentYear) {
                throw new Error('You cannot propose an outdated project')
            }
            const project = new Project(req.body)
            project.status = 'proposed'
            await project.save()

            //creating project details
            const projectDet = new projectDetails(req.body)
            projectDet.projectID = project._id
            await projectDet.save()

            await createNotification('A new Project is Proposed by ' + req.session.name + ' ( ' + req.session.role + ') and Requested Your Supervision. please review your Requests.', 'Project', '/projects/requests', teacherAccID, 'teacher')


            //creating request 
            const proposedProj = await Project.findOne({ ownerID: studentAccID })
            const proposedProjID = proposedProj._id
            const request = new Request()
            request.ownerID = teacherAccID
            request.projectID = proposedProjID
            request.requestedByID = studentAccID
            request.requestedByRole = role
            request.status = 'requested'
            await request.save()


            console.log("project Proposed successfully")
            req.flash('success', 'Project Proposed Successfully')
            res.redirect('/selfProposed')
        } else {
            const project = new Project(req.body)
            project.status = 'proposed'
            await project.save()

            //creating project details
            const projectDet = new projectDetails(req.body)
            projectDet.projectID = project._id
            await projectDet.save()

            await createNotification('A new Project is Proposed by ' + req.session.name + ' ( ' + req.session.role + '). please review proposed Projects.', 'Project', '/proposed/allProposedProjects', '', '')

            console.log("project Proposed successfully")
            req.flash('success', 'Project Proposed Successfully')
            res.redirect('/selfProposed')
        }
    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/proposed/proposeNewProject')
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
                success: req.flash('success'),
                error: req.flash('error')
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


router.post('/projects/deleteRequest/:id', async(req, res) => {
    const email = req.session.email
    const role = req.session.role
    const id = req.params.id
    try {
        const acc = await Account.findOne({ email, role })
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

            //checking that student already working on a project or not
            if (account.myProjectRequestedByID === undefined || account.myProjectRequestedByID.length == 0) {
                let flag = 'false'
                const myProj = await myProject.find({})
                if (myProj === undefined || myProj == 0) {} else {
                    myProj.forEach(proj => {
                        var members = proj.members
                        if (members === undefined || members.length == 0) {} else {
                            members.forEach(mem => {
                                if (mem.accID == account._id) {
                                    flag = 'true'
                                }
                            });
                        }
                    });
                }
                if (flag == 'true') {
                    req.flash('success', 'Project Assignation Failed . Student Already Working on a project')
                    return res.redirect('/projects/requests')
                }
            }
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
    var d = new Date();
    var n = d.getMonth() + 1;
    try {

        const account = await Account.findOne({ email, role })
        const request = new Request()
        request.ownerID = req.body.ownerID
        request.projectID = req.params.id
        request.requestedByID = account.id
        request.requestedByRole = account.role
        request.status = 'requested'

        //checking that Already requested or not
        const prevReq = await Request.find({ projectID: req.params.id, requestedByID: account._id })
        if (!prevReq.length <= 0) {
            throw new Error('Already requested for this project')
        }

        //checking that request is outdated or not 
        const projID = req.params.id
        const proj = await Project.findOne({ _id: mongoose.Types.ObjectId(projID) })
        const todaysDate = new Date()
        const currentYear = todaysDate.getFullYear()
        if (proj.year < currentYear) {
            throw new Error('choose ' + currentYear + ' projects . you cannot request this project .')
        }
        if (n > 5 && n < 8) {
            if (proj.season != "Fall") {
                throw new Error('choose ' + currentYear + ' projects . you cannot request Spring project now.')
            }
        }
        if (n > 11 && n < 2) {
            if (proj.season != "Spring") {
                throw new Error('choose ' + currentYear + ' projects . you cannot request fall project now.')
            }
        }

        await request.save()
        sendProjectRequestMail(req.session.email)
        await createNotification('You have a new request by ' + req.session.name + '  . please review Your requests .', 'Request', '/projects/requests', req.body.ownerID, 'teacher')

        req.flash('success', 'Request for this Project is sent Successfully')
        res.redirect('/projects/requests')

    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/proposed/allProposedProjects')
    }

})


module.exports = router
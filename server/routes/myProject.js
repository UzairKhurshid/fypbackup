const express = require('express')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const router = new express.Router()
const Project = require('../models/project')
const Account = require('../models/account')
const Notification = require('../models/notification')
const myProject = require('../models/myProject')
const { createNotification, getAllNotifications } = require('../helpers/notification')
const getArr = require('../helpers/supervisingFun')




router.get('/myProject', async(req, res) => {

    const role = req.session.role
    const email = req.session.email
    let project = []
    let supervisor = []
    let finalProj = []

    try {

        if (role == 'student') {
            const account = await Account.findOne({ email, role })
            await account.populate('myProjectRequestedByID').execPopulate()
            const Arr = await getAllNotifications(email, role)
            const notificationCount = Arr.length
            let projID = ''
            let projOwnerID = ''

            if (account.myProjectRequestedByID === undefined || account.myProjectRequestedByID.length == 0) {
                const myProj = await myProject.find({})
                if (myProj === undefined || myProj == 0) {} else {
                    myProj.forEach(proj => {
                        var members = proj.members
                        if (members === undefined || members.length == 0) {} else {
                            members.forEach(mem => {
                                if (mem.accID == account._id) {
                                    projID = proj.projectID
                                    projOwnerID = proj.ownerID
                                }
                            });
                        }
                    });
                    if (projID != '' && projOwnerID != '') {
                        project = await Project.findOne({ _id: mongoose.Types.ObjectId(projID) })
                        supervisor = await Account.findOne({ _id: mongoose.Types.ObjectId(projOwnerID) })
                    }
                }
            } else {
                project = await Project.findOne({ _id: account.myProjectRequestedByID[0].projectID })
                supervisor = await Account.findOne({ _id: account.myProjectRequestedByID[0].ownerID })
            }

            const chProjID = project._id
            finalProj.push(await myProject.findOne({ projectID: chProjID }))
                //removing null or undefined from array
            var index = -1,
                arr_length = finalProj ? finalProj.length : 0,
                resIndex = -1,
                result = [];

            while (++index < arr_length) {
                var value = finalProj[index];

                if (value) {
                    result[++resIndex] = value;
                }
            }

            res.render('projects/myProject', {
                title: 'FYP',
                Projects: true,
                studentLogin: 'true',
                project: result,
                projName: project.name,
                supName: supervisor.name,
                supEmail: supervisor.email,
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



router.get('/supervising', async(req, res) => {

    const role = req.session.role
    const email = req.session.email

    try {

        if (role == 'teacher') {
            const acc = await Account.findOne({ email, role })
            const Arr = await getArr(acc._id, role)
            const notificationArr = await getAllNotifications(email, role)
            const notificationCount = notificationArr.length

            res.render('projects/supervising', {
                title: 'Supervising',
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



router.get('/FYPMembers/:id', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email
    const id = req.params.id
    let membersArr = []
    let memberStatus = 'member'
    try {

        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length
        const proj = await myProject.findOne({ _id: id })
        const members = proj.members
        const chkLeaderAcc = await Account.findOne({ email, role })
        const accounts = await Account.find()

        if (members === undefined || members.length == 0) {
            console.log('no member yet')
            memberStatus = 'leader'
        } else {
            members.forEach(mem => {
                accounts.forEach((acc, j) => {
                    if (accounts[j]._id == mem.accID) {
                        accounts[j].status = mem.status
                        membersArr.push(accounts[j])
                    }
                });
                if (mem.accID == chkLeaderAcc._id && mem.status == 'leader') {
                    console.log('this member is leader of this project')
                    memberStatus = 'leader'
                }
                if (mem.accID == chkLeaderAcc._id && mem.status == '') {
                    console.log('this member is leader of this project')
                    memberStatus = 'leader'
                }
            });
        }


        if (role == 'student') {

            res.render('projects/FYPMembers', {
                title: 'FYP Members',
                studentLogin: true,
                projID: proj.id,
                members: membersArr,
                memberStatus: memberStatus,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } else if (role == 'teacher') {

            res.render('projects/FYPMembers', {
                title: 'FYP Tasks',
                teacherLogin: true,
                projID: proj.id,
                members: membersArr,
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


router.post('/FYP/newMember/:id', auth, async(req, res) => {
    const email = req.session.email
    const role = req.session.role
    const id = req.params.id
    let leaderflag = 'false'
    let flag = 'false'
    let errorMsg = 'Error'
    try {
        const regNo = req.body.regNo
        const proj = await myProject.findOne({ _id: id })
        const membersArr = proj.members
        const LeaderAcc = await Account.findOne({ email, role })
        const memberAcc = await Account.findOne({ regNo })


        //checking that leader exists or not
        membersArr.forEach((mem, i) => {
            if (mem.accID == LeaderAcc._id) {
                //console.log('Leader Exists')
                leaderflag = 'true'
            }
            if (membersArr.length >= 3) {
                //console.log('Limit Reached')
                errorMsg = 'Group Members Limit Reached'
                flag = 'true'
            }
        });
        if (leaderflag != 'true') {
            let accID = LeaderAcc._id
            const status = 'leader'
            proj.members = proj.members.concat({ accID, status })
            await proj.save()
                //console.log('group Leader Created')
        }
        //checking that account exists or not
        if (flag != 'true') {
            if (!memberAcc) {
                //console.log('Account not found')
                flag = 'true'
                errorMsg = 'Account Not Found'
            }
        }
        //checking that already a member or not
        if (flag != 'true') {
            membersArr.forEach((mem, i) => {
                if (mem.accID == memberAcc._id) {
                    //console.log('Already in your group')
                    flag = 'true'
                    errorMsg = 'Already in your group'
                }
            });
        }
        //checking that already a working on FYP or not
        if (flag != 'true') {
            await memberAcc.populate('myProjectRequestedByID').execPopulate()
            if (Object.entries(memberAcc.myProjectRequestedByID).length !== 0) {
                //console.log('Already working on a project')
                flag = 'true'
                errorMsg = 'Already working on a project'
            }
        }
        if (flag != 'true') {
            const accID = memberAcc._id
            await createNotification(LeaderAcc.name + ' has requested you to join his group in FYP . ', 'Group', '/FYP/acceptRequest/member/' + id, accID, 'student')
        }

        if (flag == 'true') {
            //console.log(errorMsg)
            req.flash('error', errorMsg)
            res.redirect('/FYPMembers/' + id)
        } else {
            //console.log('Successfully Requested ' + memberAcc.name + ' to be your group member in FYP .')
            req.flash('success', 'Successfully Requested ' + memberAcc.name + ' to be your group member in FYP .')
            res.redirect('/FYPMembers/' + id)
        }

    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/FYPMembers/' + id)
    }
})

router.get('/FYP/acceptRequest/member/:id', auth, async(req, res) => {

    const email = req.session.email
    const role = req.session.role
    const id = req.params.id
    let flag = 'false'
    let errorMsg = ''
    try {
        const acc = await Account.findOne({ email, role })
        const proj = await myProject.findOne({ _id: id })
        const members = proj.members

        members.forEach(mem => {
            if (mem.accID == acc._id) {
                //console.log(' request Already accepted')
                flag = 'true'
                errorMsg = 'request Already accepted'
            }
        });
        if (flag != 'true') {
            const status = 'member'
            proj.members = proj.members.concat({ accID: acc._id, status })
            await proj.save()
        }



        if (flag == 'true') {
            //console.log(errorMsg)
            req.flash('error', errorMsg)
            res.redirect('/FYPMembers/' + id)
        } else {
            //console.log('Successfully Accepted FYP Group Request .')
            req.flash('success', 'Successfully Accepted FYP Group Request .')
            res.redirect('/FYPMembers/' + id)
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
        const acc = await Account.findOne({ email, role })
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
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } else if (role == 'teacher') {

            res.render('projects/FYPTasks', {
                title: 'FYP Tasks',
                teacherLogin: true,
                projID: proj.id,
                tasks: proj.tasks,
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
        await createNotification('Your have a new Task . please review Your FYP tasks .', 'Task', '/FYPTasks/' + id, proj.requestedByID, 'student')

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
        await createNotification('Your Task is marked Completed . please review Your FYP Progress .', 'Task', '/FYPTasks/' + id, proj.requestedByID, 'student')

        req.flash('success', 'Status Changed Successfully')
        res.redirect('/FYPTasks/' + id)

    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/FYPTasks/' + id)
    }

})


module.exports = router
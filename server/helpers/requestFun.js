const Account = require('../models/account')
const Project = require('../models/project')
const Notification = require('../models/notification')


const getArr = async(email, role) => {

    let i = 0
    let teacher = []
    let student = []
    let project = []
    var Arr = []
    const newObj = {
        requestID: '123',
        projectID: '123',
        projectName: 'abc',
        ownerName: 'ad',
        ownerEmail: 'ab',
        requestedByName: 'abc',
        requestedByEmail: 'abc@gmail.com',
    }

    if (role == 'student') {
        const account = await Account.findOne({ email })

        if (!account) {
            return res.redirect('/dashboard')
        }

        await account.populate('requestedByProject').execPopulate()

        for (i = 0; i < account.requestedByProject.length; i++) {
            project[i] = await Project.findOne({ _id: account.requestedByProject[i].projectID })
            teacher[i] = await Account.findOne({ email: account.requestedByProject[i].ownerEmail })
        }
        for (i = 0; i < project.length; i++) {
            let obj = Object.create(newObj)

            obj.requestID = account.requestedByProject[i]._id
            obj.projectID = account.requestedByProject[i].projectID
            obj.projectName = project[i].name
            obj.ownerName = project[i].ownerName
            obj.ownerEmail = account.requestedByProject[i].ownerEmail

            Arr[i] = obj
        }
    } else if (role == 'teacher') {

        const account = await Account.findOne({ email })

        if (!account) {
            return res.redirect('/dashboard')
        }

        await account.populate('requestToProject').execPopulate()


        for (i = 0; i < account.requestToProject.length; i++) {
            project[i] = await Project.findOne({ _id: account.requestToProject[i].projectID })
            student[i] = await Account.findOne({ email: account.requestToProject[i].requestedByEmail })
        }
        for (i = 0; i < project.length; i++) {
            let obj = Object.create(newObj)

            obj.requestID = account.requestToProject[i]._id
            obj.projectID = account.requestToProject[i].projectID
            obj.ownerEmail = account.requestToProject[i].ownerEmail
            obj.projectName = project[i].name
            obj.requestedByName = student[i].name
            obj.requestedByEmail = student[i].email

            Arr[i] = obj
        }
    }

    return Arr
}

module.exports = getArr
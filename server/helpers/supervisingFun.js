const Account = require('../models/account')
const Project = require('../models/project')
const Notification = require('../models/notification')


const getArr = async(email, role) => {
    let i = 0
    let student = []
    let project = []
    var Arr = []
    const newObj = {
        FYPID: '123',
        projectID: '123',
        projectName: 'abc',
        projectYear: '2010',
        requestedByName: 'abc',
        requestedByEmail: 'abc@gmail.com',
    }

    const account = await Account.findOne({ email, role })
    if (!account) {
        return res.redirect('/dashboard')
    }

    await account.populate('myProjectOwnerEmail').execPopulate()

    for (i = 0; i < account.myProjectOwnerEmail.length; i++) {
        project[i] = await Project.findOne({ _id: account.myProjectOwnerEmail[i].projectID })
        student[i] = await Account.findOne({ email: account.myProjectOwnerEmail[i].requestedByEmail })
    }


    for (i = 0; i < project.length; i++) {
        let obj = Object.create(newObj)

        obj.FYPID = account.myProjectOwnerEmail[i]._id
        obj.projectID = account.myProjectOwnerEmail[i].projectID
        obj.projectName = project[i].name
        obj.projectYear = project[i].year
        obj.requestedByName = student[i].name
        obj.requestedByEmail = student[i].email

        Arr[i] = obj
    }
    return Arr
}

module.exports = getArr
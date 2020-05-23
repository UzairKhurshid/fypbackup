const Account = require('../models/account')
const Project = require('../models/project')


const getArr = async(id, role) => {
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

    const account = await Account.findOne({ _id: id })
    await account.populate('myProjectOwnerID').execPopulate()

    for (i = 0; i < account.myProjectOwnerID.length; i++) {
        project[i] = await Project.findOne({ _id: account.myProjectOwnerID[i].projectID })
        student[i] = await Account.findOne({ _id: account.myProjectOwnerID[i].requestedByID })
    }

    for (i = 0; i < project.length; i++) {
        let obj = Object.create(newObj)
        obj.FYPID = account.myProjectOwnerID[i]._id
        obj.projectID = account.myProjectOwnerID[i].projectID
        obj.projectName = project[i].name
        obj.projectYear = project[i].year
        obj.requestedByName = student[i].name
        obj.requestedByEmail = student[i].email

        Arr[i] = obj
    }
    return Arr
}

module.exports = getArr
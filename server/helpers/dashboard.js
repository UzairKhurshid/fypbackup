const Account = require('../models/account')
const Project = require('../models/project')
const myProject = require('../models/myProject')
const mongoose = require('mongoose')


const getAdminData = async(email, role) => {

    let newObj = {
        txt: 'abc',
        refTable: 'abc',
        refRoute: 'abc',
        createdAt: 'abc'
    }

    return []
}

const getTeacherData = async(email, role) => {

    let i = 0
    let student = []
    let project = []
    var Arr = []
    let teacherObj = {
        FYPID: 'abc',
        projectID: 'abc',
        projectName: 'abc',
        projectLanguage: 'abc',
        projectIDE: 'abc',
        projectType: 'abc',
        projectDepartment: 'abc',
        projectSemester: 'abc',
        projectYear: 'abc',
        projectDescription: 'abc',
        projectTasks: [],
        studentID: 'abc',
        studentregNo: 'abc',
        studentName: 'abc',
        studentEmail: 'abc',
        studentCampus: 'abc',
        studentDepartment: 'abc',
        studentSemester: 'abc',
    }
    const account = await Account.findOne({ email, role })
    await account.populate('myProjectOwnerID').execPopulate()
    for (i = 0; i < account.myProjectOwnerID.length; i++) {
        project[i] = await Project.findOne({ _id: account.myProjectOwnerID[i].projectID })
        student[i] = await Account.findOne({ _id: account.myProjectOwnerID[i].requestedByID })
    }
    for (i = 0; i < project.length; i++) {
        let obj = Object.create(teacherObj)
        obj.FYPID = account.myProjectOwnerID[i]._id
        obj.projectID = account.myProjectOwnerID[i].projectID
        obj.projectName = project[i].name
        obj.projectLanguage = project[i].language
        obj.projectIDE = project[i].IDE
        obj.projectType = project[i].type
        obj.projectDepartment = project[i].department
        obj.projectSemester = project[i].semester
        obj.projectYear = project[i].year
        obj.projectDescription = project[i].description
        obj.projectTasks = account.myProjectOwnerID[i].tasks
        obj.studentID = student[i].id
        obj.studentregNo = student[i].regNo
        obj.studentName = student[i].name
        obj.studentEmail = student[i].email
        obj.studentCampus = student[i].campus
        obj.studentDepartment = student[i].department
        obj.studentSemester = student[i].semester
        Arr[i] = obj
    }
    return Arr
}

const getStudentData = async(email, role) => {

    let newObj = {
        txt: 'abc',
        refTable: 'abc',
        refRoute: 'abc',
        createdAt: 'abc'
    }


    return []
}

module.exports = { getAdminData, getTeacherData }
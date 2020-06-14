const Account = require('../models/account')
const Project = require('../models/project')
const myProject = require('../models/myProject')
const mongoose = require('mongoose')


const getAdminData = async(email, role) => {
    const accounts = await Account.find({ status: 'disable' }).sort({ name: 'asc' });
    const teachers = await Account.find({ role: 'teacher' });
    const students = await Account.find({ role: 'student' });
    const projects = await Project.find({});

    data = {
        accounts: accounts,
        studentsCount: students.length,
        teachersCount: teachers.length,
        projectsCount: projects.length
    };
    return data;
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
        projectLetter: 'abc',
        projectLanguage: 'abc',
        projectIDE: 'abc',
        projectType: 'abc',
        projectDepartment: 'abc',
        projectSemester: 'abc',
        projectYear: 'abc',
        projectDescription: 'abc',
        projectTasks: [],
        projectTasksCount: 'abc',
        studentID: 'abc',
        studentregNo: 'abc',
        studentName: 'abc',
        studentLetter: 'abc',
        studentEmail: 'abc',
        studentCampus: 'abc',
        studentDepartment: 'abc',
        studentSemester: 'abc',
        studentAvatar: 'abc'
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
        obj.projectLetter = project[i].name[0]
        obj.projectLanguage = project[i].language
        obj.projectIDE = project[i].IDE
        obj.projectType = project[i].type
        obj.projectDepartment = project[i].department
        obj.projectSemester = project[i].semester
        obj.projectYear = project[i].year
        obj.projectDescription = project[i].description
        obj.projectTasks = account.myProjectOwnerID[i].tasks
        obj.projectTasksCount = account.myProjectOwnerID[i].tasks.length
        obj.studentID = student[i].id
        obj.studentregNo = student[i].regNo
        obj.studentName = student[i].name
        obj.studentLetter = student[i].name[0]
        obj.studentEmail = student[i].email
        obj.studentCampus = student[i].campus
        obj.studentDepartment = student[i].department
        obj.studentSemester = student[i].semester
        obj.studentAvatar = student[i].avatar
        Arr[i] = obj
    }
    return Arr
}

const getStudentData = async(email, role) => {
    let project = []
    let teacher = []
    let projMembers = []
    let membersData = []
    let fyp = []
    const account = await Account.findOne({ email, role })
    const myproject = await myProject.findOne({ requestedByID: account._id })
    let teacherAvatar;
    let flag = false

    if (myproject === null) {
        const myProj = await myProject.find({})
        if (myProj === undefined || myProj == 0) {} else {
            myProj.forEach(proj => {
                var members = proj.members
                if (members === undefined || members.length == 0) {} else {
                    members.forEach(async(mem) => {
                        if (mem.accID == account._id) {
                            fyp = proj
                            flag = true
                        }
                    });

                }
            });

        }
    } else {
        flag = true
        fyp = myproject
    }

    if (flag == true) {
        membersData = fyp.members
        if (membersData === undefined || membersData.length == 0) {} else {
            membersData.forEach(async(projMem) => {
                let stdAccData = await Account.findOne({ _id: projMem.accID })
                projMembers.push(stdAccData)
            });
        }
        project = await Project.findOne({ _id: fyp.projectID })
        teacher = await Account.findOne({ _id: fyp.ownerID })
    }

    obj = { project_data: fyp, project: project, projMembers: projMembers, teacher: teacher }
    return obj;
}

module.exports = { getAdminData, getTeacherData, getStudentData }
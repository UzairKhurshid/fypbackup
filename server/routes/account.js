const express = require('express')
const auth = require('../middleware/auth')
const Account = require('../models/account')
const { getAllNotifications } = require('../helpers/notification')

const { sendWelcomeMail, sendActivationMail, sendDeActivationMail, sendProjectAcceptanceMail, sendProjectRequestMail } = require('../emailSender/email')
const router = new express.Router()


router.get('/adminAccounts', auth, async(req, res) => {

    const accRole = req.session.role
    const email = req.session.email

    try {
        const Arr = await getAllNotifications(email, accRole)
        const notificationCount = Arr.length
        if (req.query.role == 'teacher') {
            const acc = await Account.find({ role: 'teacher' })
            const accounts = await Account.find({ role: 'teacher' }).sort({ name: 'asc' })
            const count = Object.keys(acc).length

            res.render('accounts/index', {
                title: 'Accounts',
                Admins: true,
                adminLogin: 'true',
                teacherAcc: 'true',
                account: accounts,
                count: count,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (req.query.role == 'student') {
            const acc = await Account.find({ role: 'student' })
            const accounts = await Account.find({ role: 'student' }).sort({ name: 'asc' })
            const count = Object.keys(acc).length


            res.render('accounts/index', {
                title: 'Accounts',
                Admins: true,
                adminLogin: 'true',
                account: accounts,
                studentAcc: 'true',
                count: count,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (req.query.role == 'admin') {
            const acc = await Account.find({ role: 'admin' })
            const accounts = await Account.find({ role: 'admin', email: { $ne: email } }).sort({ name: 'asc' })
            const count = Object.keys(acc).length

            res.render('accounts/index', {
                title: 'Accounts',
                Admins: true,
                adminLogin: 'true',
                account: accounts,
                adminAcc: 'true',
                count: count,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else {
            const acc = await Account.find({ email: { $ne: email } })
            const accounts = await Account.find({ email: { $ne: email } }).sort({ name: 'asc' })
            const count = Object.keys(acc).length

            res.render('accounts/index', {
                title: 'Accounts',
                Admins: true,
                adminLogin: 'true',
                account: accounts,
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



router.get('/adminAccount/create', auth, async(req, res) => {
    const email = req.session.email
    const role = req.session.role
    try {
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length

        res.render('accounts/create', {
            Admins: true,
            adminLogin: 'true',
            title: 'Create Account',
            notification: Arr,
            notificationCount: notificationCount,
            accAvatar: req.session.avatar,
            accountName: req.session.name
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})

router.post('/adminAccount/create', auth, async(req, res) => {

    try {
        const account = new Account(req.body)
        await account.save()
        req.flash('success', 'Account Created Successfully')
        res.redirect('/adminAccounts')
    } catch (e) {
        console.log(e.message)
        req.flash('error', '' + e.message)
        res.redirect('/adminAccount/create')
    }
})


router.get('/adminAccount/update/:id', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email
    const id = req.params.id
    try {

        const acc = await Account.findOne({ _id: id })
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length
        if (acc.role == 'admin') {
            res.render('accounts/update', {
                Admins: true,
                account: acc,
                adminAcc: true,
                adminLogin: 'true',
                title: 'Update Account',
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success')
            })
        }
        if (acc.role == 'teacher') {
            res.render('accounts/update', {
                Admins: true,
                account: acc,
                teacherAcc: true,
                adminLogin: 'true',
                title: 'Update Account',
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success')
            })
        } else if (acc.role == 'student') {
            res.render('accounts/update', {
                Admins: true,
                account: acc,
                studentAcc: true,
                adminLogin: 'true',
                title: 'Update Account',
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

router.post('/adminAccount/update/:id', auth, async(req, res) => {

    const updates = Object.keys(req.body)
    const id = req.params.id
    try {

        const account = await Account.findOne({ _id: id })
        if (!req.body.password) {
            req.body.password = account.password
        }

        updates.forEach((update) => account[update] = req.body[update])
        await account.save()

        if (req.body.status == 'enable') {
            sendActivationMail(req.body.email, req.body.name)
        } else if (req.body.status == 'disable') {
            sendDeActivationMail(req.body.email, req.body.name)
        }

        console.log("Updated Successfully")
        req.flash('success', 'Account Updated Successfully')
        return res.redirect('/adminAccounts')

    } catch (e) {
        console.log(e.message)
        req.flash('error', '' + e.message)
        res.redirect('/adminAccount/update/' + id)
    }
})



router.post('/adminAccount/delete/:id', auth, async(req, res) => {

    const id = req.params.id
    try {
        await Account.findOneAndDelete({ _id: id })
        console.log("deleted Successfully")

        req.flash('success', 'Account Deleted Successfully')
        return res.redirect('/adminAccounts')
    } catch (e) {
        console.log(e.message)
        req.flash('error', '' + e.message)
        res.redirect('/adminAccounts')
    }
})



module.exports = router
const express = require('express')
const auth = require('../middleware/auth')
const Account = require('../models/account')
const { getAllNotifications } = require('../helpers/notification')

const { sendWelcomeMail, sendActivationMail, sendDeActivationMail, sendProjectAcceptanceMail, sendProjectRequestMail } = require('../emailSender/email')
const router = new express.Router()


router.get('/adminAccounts', auth, async(req, res) => {

    const role = req.session.role
    const email = req.session.email
    let limit = 0,
        page = 0
    if (!req.query.limit) { limit = 5 } else { limit = req.query.limit }
    if (!req.query.page) { page = 1 } else { page = req.query.page }
    try {
        const acc = await Account.find()
        const accounts = await Account.find().sort({ name: 'asc' }).limit(limit * 1).skip((page - 1) * limit)
        const count = Object.keys(acc).length
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length

        res.render('accounts/index', {
            title: 'Accounts',
            Admins: true,
            account: accounts,
            adminLogin: 'true',
            count: count,
            page: page,
            notification: Arr,
            notificationCount: notificationCount,
            accountName: req.session.name,
            success: req.flash('success')
        })
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
            accountName: req.session.name
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})

router.post('/adminAccount/create', auth, async(req, res) => {
    const account = new Account(req.body)
    try {
        await account.save()
        req.flash('success', 'Account Created Successfully')
        res.redirect('/adminAccounts')
    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
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

        res.render('accounts/update', {
            Admins: true,
            account: acc,
            adminLogin: 'true',
            title: 'Update Account',
            notification: Arr,
            notificationCount: notificationCount,
            accountName: req.session.name,
            success: req.flash('success')

        })
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
        res.redirect('/adminAccounts')

    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})



router.post('/adminAccount/delete/:id', auth, async(req, res) => {

    const id = req.params.id

    try {
        await Account.findOneAndDelete({ _id: id })
        console.log("deleted Successfully")
        req.flash('success', 'Account Deleted Successfully')
        res.redirect('/adminAccounts')


    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/dashboard')
    }
})



module.exports = router
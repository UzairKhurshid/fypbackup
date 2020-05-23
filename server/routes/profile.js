const express = require('express')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const Account = require('../models/account')
const { getAllNotifications } = require('../helpers/notification')
const router = new express.Router()


router.get('/profile', auth, async(req, res) => {
    const role = req.session.role
    const email = req.session.email
    try {
        const account = await Account.findOne({ email, role })
        const Arr = await getAllNotifications(email, role)
        const notificationCount = Arr.length

        if (role == 'admin') {
            res.render('profile/profile', {
                title: 'Profile',
                adminLogin: true,
                account: account,
                notification: Arr,
                notificationCount: notificationCount,
                accAvatar: req.session.avatar,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } else if (role == 'student') {
            res.render('profile/profile', {
                title: 'Profile',
                studentLogin: true,
                account: account,
                notification: Arr,
                notificationCount: notificationCount,
                accountName: req.session.name,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } else if (role == 'teacher') {
            res.render('profile/profile', {
                title: 'Profile',
                teacherLogin: true,
                account: account,
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


router.post('/profile/update/:id', auth, async(req, res) => {
    const id = req.params.id
    const updates = Object.keys(req.body)
    try {
        const account = await Account.findOne({ _id: id })
        if (!req.body.password) {
            req.body.password = account.password
        }
        updates.forEach((update) => account[update] = req.body[update])
        await account.save()

        req.flash('success', 'Account Updated Successfully')
        res.redirect('/profile')

    } catch (e) {
        console.log(e.message)
        req.flash('success', e.message)
        res.redirect('/profile')
    }
})



router.post('/profile/updateAvatar/:id', auth, async(req, res) => {
    const id = req.params.id
    try {
        const account = await Account.findOne({ _id: id })
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).jpeg().toBuffer()
        account.avatar = buffer.toString('base64')
        await account.save()
        req.session.avatar = buffer.toString('base64')
        req.flash('success', 'Successfully Uploaded Profile Picture')
        res.redirect('/profile')
    } catch (e) {
        console.log(e.message)
        req.flash('error', 'Error uploading profile picture')
        res.redirect('/profile')
    }
})


module.exports = router
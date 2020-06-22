const express = require('express')
const router = new express.Router()
const Account = require('../models/account')
const authentication = require('../middleware/auth')
const { createNotification } = require('../helpers/notification')
const { sendWelcomeMail, sendActivationMail, sendDeActivationMail, sendProjectAcceptanceMail, sendProjectRequestMail } = require('../emailSender/email')




router.get('/login', (req, res) => {
    if (!req.session.email) {
        res.render('auth/selectLogin', {
            title: 'Login',
            layout: 'layouts/auth'
        })
    }
})


router.get('/login/:role', (req, res) => {
    const role = req.params.role

    if (role === 'student' || role === 'teacher' || role === 'admin') {
        if (!req.session.email) {

            return res.render('auth/login', {
                title: role + " login",
                layout: 'layouts/auth',
                role: role,
                error: req.flash('error')
            })
        } else {
            return res.redirect('/')
        }
    } else {
        return res.render('404', {
            title: '404 Page'
        })
    }
})

router.post('/login/:role', async(req, res) => {
    const role = req.params.role

    try {
        const account = await Account.findByCredentionals(req.body.email, req.body.password, role)

        req.session.avatar = account.avatar
        req.session.name = account.name
        req.session.role = role
        req.session.email = account.email


        res.redirect('/dashboard')
    } catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        return res.redirect('/login/'.concat(role))
    }
})

router.get('/signup', (req, res) => {
    if (!req.session.email) {
        res.render('auth/selectSignup', {
            title: 'Signup',
            layout: 'layouts/auth'
        })
    }
})



router.get('/signup/:role', (req, res) => {
    const role = req.params.role
    if (role == 'teacher') {
        res.render('auth/signup', {
            title: role + ' signup',
            layout: 'layouts/auth',
            role: role,
            teacherAcc: 'true',
            error: req.flash('error')
        })
    } else if (role == 'student') {
        res.render('auth/signup', {
            title: role + ' signup',
            layout: 'layouts/auth',
            role: role,
            studentAcc: 'true',
            error: req.flash('error')
        })
    } else {
        res.redirect('/signup')
    }
})

router.post('/signup/:role', async(req, res) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const role = req.params.role
    let flag = true

    try {
        const AllAcc = await Account.find({ role })
        AllAcc.forEach(Acc => {
            if (Acc.regNo == req.body.regNo) {
                flag = true
            }
        });
        if (flag == true) {
            req.flash('error', 'Account With this registeration no already exists')
            return res.redirect('/login/'.concat(role))
        } else {
            const account = new Account(req.body)
            account.status = "disable"
            account.role = role
            await account.save()
            await createNotification('A new Account has been created . Please review accounts.', 'Account', '/adminAccounts', '', 'admin')
            sendWelcomeMail(req.body.email, req.body.name)

            req.flash('success', 'Account Created Successfully')
            return res.redirect('/login/'.concat(role))
        }


    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('/signup/'.concat(role))
    }
})


router.get('/logout', authentication, (req, res) => {
    try {
        req.session.destroy((err) => {
            console.log(err)
            res.redirect('/login')
        })
    } catch (e) {
        console.log(e.message)
    }
})

module.exports = router
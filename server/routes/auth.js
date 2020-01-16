const express=require('express')
const router=new express.Router()

router.get('/login', function (req, res) {
    res.render('auth/login',{
        title:'Login', 
        layout: 'layouts/auth'
    })
    req.session.working='yes'
  })



module.exports=router
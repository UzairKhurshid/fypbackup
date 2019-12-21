const express=require('express')
const router=new express.Router()

router.get('/', function (req, res) {
    res.render('dashboard/index',{
        title:'Dashboard'
    })
    req.session.working='yes'
  })



module.exports=router
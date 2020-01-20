const express=require('express')
const auth=require('../middleware/auth')
const router=new express.Router()


router.get('/', auth, (req, res) => {
    res.render('dashboard/index',{
        title:'Dashboard',
        Dashboard:true,
    })
  })



module.exports=router
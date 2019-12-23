const express=require('express')
const router=new express.Router()

router.get('/', function (req, res) {
    res.render('dashboard/index',{
<<<<<<< HEAD
        title:'Dashboard'
=======
        title:'Dashboard',
        Dashboard:true,
>>>>>>> 86c187c04ea3eba36c3f00a5e0f08016306b6bf3
    })
    req.session.working='yes'
  })



module.exports=router
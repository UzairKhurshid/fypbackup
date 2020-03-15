const express=require('express')
const router=new express.Router()


router.get('/',(req,res)=>{
  
  if(!req.session.email){
    res.render('pages/home',{
      title:'Home',
      layout:'layouts/public'
    })  
  }

})

module.exports=router
const express=require('express')
const router=new express.Router()
const Student=require('../models/student')
const Teacher=require('../models/teacher')
const authentication=require('../middleware/auth')

router.get('/login',  (req, res) =>{
  if(!req.session.email){
    res.render('auth/login',{
        title:'Login', 
        layout: 'layouts/auth'
    })
  }
  res.redirect('/')
  })

  router.post('/login',async(req,res)=>{
    console.log(req.body.role)
    try{
      if(req.body.role=="teacher"){
          const teacher=await Teacher.findByCredentionals(req.body.email,req.body.password)
          req.session.role="teacher"
      }
      else if(req.body.role=="student"){
          const student=await Student.findByCredentionals(req.body.email,req.body.password)
          req.session.role="student"
      }
      
      req.session.email=req.body.email
      res.redirect('/')
      
    }catch(e){
      console.log(e) 
      res.render('auth/login',{
        title:'Login', 
        layout: 'layouts/auth'
    })
    }
  })

  router.get('/logout',authentication,(req,res)=>{ 
    try{
      req.session.destroy((err)=>{
          console.log(err)
          res.render('auth/login',{
            title:'Login', 
            layout: 'layouts/auth'
        })
      })
      }catch(e){
          console.log(e) 
      }
  })



module.exports=router
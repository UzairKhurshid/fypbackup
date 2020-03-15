const express=require('express')
const router=new express.Router()
const Admin=require('../models/admin')
const Student=require('../models/student')
const Teacher=require('../models/teacher')
const authentication=require('../middleware/auth')


router.get('/login',(req,res)=>{
  
  if(!req.session.email){
    res.render('auth/selectLogin',{
      title:'Login',
      layout:'layouts/auth'
    })  
  }

})


router.get('/login/:role',(req, res) =>{
  const role = req.params.role
  
  console.log(express.static('public'))

  if(role === 'student' || role === 'teacher' || role === 'admin'){
    if(!req.session.email){
     
     return res.render('auth/login',{
          title:role+" login", 
          layout: 'layouts/auth',
          role:role,
          error:req.flash('error')
      })

    }
    else{
      return res.redirect('/')
    }
  }
  else{
    return res.render('404',{
      title:'404 Page'
    })
  }
  
  })

  router.post('/login/:role',async(req,res)=>{
    
    const role=req.params.role

    try{
      if(role=="teacher"){
          const teacher=await Teacher.findByCredentionals(req.body.email,req.body.password)
          req.session.role="teacher"
          req.session.email=req.body.email
          
          res.redirect('/')
      }
      else if(role=="student"){
          const student=await Student.findByCredentionals(req.body.email,req.body.password)
          req.session.role="student"
          req.session.email=req.body.email

          res.redirect('/')
      }
      else if(role=="admin"){
          const admin=await Admin.findByCredentionals(req.body.email,req.body.password)
          req.session.role="admin"
          req.session.email=req.body.email

          res.redirect('/')
      }
      }catch(e){
      
        req.flash('error',e.message) 
        return res.redirect('/login/'.concat(role))
    
    
    }
  })

  router.get('/signup',(req,res)=>{
  
    if(!req.session.email){
      res.render('auth/selectSignup',{
        title:'Signup',
        layout:'layouts/auth'
      })  
    }
  
  })
  


  router.get('/signup/:role',  (req, res) =>{
    const role=req.params.role
    console.log(role)
    res.render('auth/signup',{
          title:role+' signup', 
          layout: 'layouts/auth',
          role:role,
          error:req.flash('error')
      })
    
    })

    router.post('/signup/:role',async(req,res)=>{
      
      const role=req.params.role

      try{

        if(role=="student"){

            const student=new Student(req.body)  
            student.status="disable"

            await student.save()
            req.flash('success','Account Created Successfully')
            return res.redirect('/login/'.concat(role))
          
          }
          else if(role=="teacher"){
          
            const teacher=new Teacher(req.body)
            teacher.status="disable"

            await teacher.save()
            req.flash('success','Account Created Successfully')
            return res.redirect('/login/'.concat(role))
          
          }
      }catch(e){
        req.flash('error',e.message) 
        return res.redirect('/signup/'.concat(role))
    }
    })


    router.get('/logout',authentication,(req,res)=>{ 
      try{
        req.session.destroy((err)=>{
            console.log(err)
            res.redirect('/login')
        })
        }catch(e){
            console.log(e.message) 
        }
    })

    // router.get('/disableAccount',auth,async(req,res)=>{

    // })

module.exports=router
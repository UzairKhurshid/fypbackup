const express=require('express')
const auth=require('../middleware/auth')
const Project=require('../models/project')
const router=new express.Router()


router.get('/dashboard',auth, async(req, res) => {

  try{
    const role=req.session.role
    const projects=await Project.find({ status:'accepted' })
  
      if(role==="admin"){
          console.log('admin')
          res.render('dashboard/index',{
            title:'Admin Dashboard',
            adminLogin:'true',
            Dashboard:true,
            success:req.flash('success')
          })
      }
      else if(role==="student"){
          console.log('Student')
          res.render('dashboard/index',{
            title:'Student Dashboard',
            studentLogin:'true',
            Dashboard:true,
            project:projects,
            success:req.flash('success')
          })
      }
      else if(role==="teacher"){
          console.log('teacher')
          res.render('dashboard/index',{
            title:'Teacher Dashboard',
            teacherLogin:'true',
            Dashboard:true,
            project:projects,
            success:req.flash('success')
          })
      }
  }catch(e){
        console.log(e)
  }
  
    
  })


module.exports=router
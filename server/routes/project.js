const express=require('express')
const auth=require('../middleware/auth')
const router=new express.Router()
const Project=require('../models/project')
const Student=require('../models/student')
const Teacher=require('../models/teacher')

router.get('/admin/projects', auth, async (req, res)=> {
    try{
        const projects=await Project.find({ status:'accepted' })
        
        res.render('projects/index',{
            title:'Projects',
            Projects:true,
            adminLogin:'true',
            project:projects,
            success:req.flash('success')
        }) 
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
  })
  router.get('/admin/proposedProjects', auth, async (req, res)=> {
    try{
        const projects=await Project.find({ status:'proposed' })
        
        res.render('projects/index',{
            title:'Projects',
            Projects:true,
            adminLogin:'true',
            project:projects,
            success:req.flash('success')
        }) 
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
  })


router.get('/admin/projects/create',auth, async (req, res)=> {
    res.render('projects/create',{
        title:'projects',
        adminLogin:'true',
        Projects:true,
    })
    console.log(req.session.working)
  })

router.post('/admin/projects/create',auth,async(req,res)=>{
    const role=req.session.role
    const project=new Project(req.body)
    project.ownerRole=role
    project.status='accepted'
    
    try{
        await project.save()
        console.log("project saves successfully")
        req.flash('success','Projectd Created Successfully')
        res.redirect('/admin/projects')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})




router.get('/admin/projects/update/:id',auth,async(req,res)=>{
    const role=req.session.role
    
    try{
        const id = req.params.id 
        const prj=await Project.findOne({_id:id})
        
        if (role=='admin'){
            res.render('projects/update',{
                title:'project',
                Projects:true,
                adminLogin:'true',
                project:prj,
                success:req.flash('success')
            })
        }
        else if(role=='teacher'){
            res.render('projects/update',{
                title:'project',
                Projects:true,
                teacherLogin:'true',
                project:prj,
                success:req.flash('success')
            })
        }
        else if(role=='student'){
            res.render('projects/update',{
                title:'project',
                Projects:true,
                studentLogin:'true',
                project:prj,
                success:req.flash('success')
            })
        }
        
    }
    catch(e){
        console.log(e)
        res.redirect('/')
    }
})

router.post('/admin/projects/update/:id',auth,async(req,res)=>{
    
    const updates=Object.keys(req.body)
    
    const id = req.params.id 

    try{

        const project=await Project.findOne({_id:id})
        updates.forEach((update) => project[update] = req.body[update] )
        await project.save()

        console.log("Updated SUccessfully")
        req.flash('success','Project Updated Successfully')
        res.redirect('/admin/projects/update/'+id)
    } catch(e){
        console.log(e)
        res.redirect('/')
    } 
})


router.get('/admin/projects/delete',auth,(req,res)=>{
    res.render('projects/delete',{
        title:'projects',
        adminLogin:'true',
        Projects:true,
    })
})

router.post('/admin/projects/delete/:id',auth,async(req,res)=>{

    const id=req.params.id
    
    try{
        await Project.findOneAndDelete({_id:id})
        console.log("deleted Successfully")
        req.flash('success','Project deleted successfully')
        res.redirect('/admin/projects')
    } catch(e){
        console.log(e)
        res.redirect('/')
    }
})




router.get('/projects/viewproject/:id',auth,async(req,res)=>{
    const id=req.params.id  
    const role=req.session.role
    try{
  
      const proj=await Project.findOne({_id:id})
      if(role=='admin'){
        res.render('projects/viewproject',{
          title:'project',
          Projects:true,
          adminLogin:'true',
          project:proj,
          success:req.flash('success')
        })
      }
      else if(role=='student'){
        res.render('projects/viewproject',{
          title:'project',
          Projects:true,
          studentLogin:'true',
          project:proj,
          success:req.flash('success')
        })
      }
      else if(role=='teacher'){
        res.render('projects/viewproject',{
          title:'project',
          Projects:true,
          teacherLogin:'true',
          project:proj,
          success:req.flash('success')
      })
      }
        
  
      }catch(e){
        console.log(e)
        res.redirect('/')
      }
  })
  

module.exports=router
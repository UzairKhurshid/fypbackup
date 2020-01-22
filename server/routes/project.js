const express=require('express')
const auth=require('../middleware/auth')
const router=new express.Router()
const Project=require('../models/project')


router.get('/projects', auth, async (req, res)=> {
    try{
        const projects=await Project.find()
        
        res.render('projects/index',{
            title:'Projects',
            Projects:true,
            project:projects,
            success:req.flash('success')
        })
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
  })


router.get('/projects/create',auth, async (req, res)=> {
    res.render('projects/create',{
        title:'projects',
        Projects:true,
    })
    console.log(req.session.working)
  })

router.post('/projects/create',auth,async(req,res)=>{
    const project=new Project(req.body)
    
    try{
        await project.save()
        console.log("project saves successfully")
        req.flash('success','Projectd Created Successfully')
        res.redirect('/projects')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})




router.get('/projects/update/:id',auth,async(req,res)=>{
    try{
        const id = req.params.id 
        const std=await Project.findOne({_id:id})
        res.render('projects/update',{
            title:'project',
            Projects:true,
            project:std,
            success:req.flash('success')
        })
    }
    catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.post('/projects/update/:id',auth,async(req,res)=>{
    
    const updates=Object.keys(req.body)
    const id = req.params.id 

    try{

        const project=await Project.findOne({_id:id})
        updates.forEach((update) => project[update] = req.body[update] )
        await project.save()
        console.log("Updated SUccessfully")
        req.flash('success','Projectd Updated Successfully')
        res.redirect('/projects/update/'+id)
    } catch(e){
        console.log(e)
        res.redirect('/')
    } 
})


router.get('/projects/delete',auth,(req,res)=>{
    res.render('projects/delete',{
        title:'projects',
        Projects:true,
    })
})

router.post('/projects/delete/:id',auth,async(req,res)=>{

    const id=req.params.id
    
    try{
        await Project.findOneAndDelete({_id:id})
        console.log("deleted Successfully")
        req.flash('success','Project deleted successfully')
        res.redirect('/projects')
    } catch(e){
        console.log(e)
        res.redirect('/')
    }
})


module.exports=router
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
            project:projects
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
        res.redirect('/projects/create')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})




router.get('/projects/update',auth,(req,res)=>{
    res.render('projects/update',{
        title:'project',
        Projects:true,
    })
})
router.post('/projects/update',auth,async(req,res)=>{
    
    const updates=Object.keys(req.body)
    const name=req.body.name

    try{

        const project=await Project.findOne({name})
        

        updates.forEach((update) => project[update] = req.body[update] )
        await project.save()

        console.log("Updated SUccessfully")
        const projects=await Project.find()
        res.render('projects/index',{
            title:'projects',
            project:projects
        })

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
router.post('/projects/delete',auth,async(req,res)=>{

    const name=req.body.name
    
    try{
        await Project.findOneAndDelete({name})
        console.log("deleted Successfully")

        const projects=await Project.find()
        res.render('projects/index',{
            title:'projects',
            project:projects
        })


    } catch(e){
        console.log(e)
        res.redirect('/')
    }
})


module.exports=router
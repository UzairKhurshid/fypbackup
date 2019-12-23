const express=require('express')
const router=new express.Router()
const Project=require('../models/project')


router.get('/projects', async (req, res)=> {
    try{
        const projects=await Project.find()
        
        res.render('projects/index',{
<<<<<<< HEAD
            title:'Project',
=======
            title:'Projects',
            Projects:true,
>>>>>>> 86c187c04ea3eba36c3f00a5e0f08016306b6bf3
            project:projects
        })
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
  })





router.get('/projects/create', async (req, res)=> {
    res.render('projects/create',{
<<<<<<< HEAD
        title:'projects'
=======
        title:'projects',
        Projects:true,
>>>>>>> 86c187c04ea3eba36c3f00a5e0f08016306b6bf3
    })
    console.log(req.session.working)
  })

router.post('/projects/create',async(req,res)=>{
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




router.get('/projects/update',(req,res)=>{
    res.render('projects/update',{
<<<<<<< HEAD
        title:'project'
=======
        title:'project',
        Projects:true,
>>>>>>> 86c187c04ea3eba36c3f00a5e0f08016306b6bf3
    })
})
router.post('/projects/update',async(req,res)=>{
    
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





router.get('/projects/delete',(req,res)=>{
    res.render('projects/delete',{
<<<<<<< HEAD
        title:'projects'
=======
        title:'projects',
        Projects:true,
>>>>>>> 86c187c04ea3eba36c3f00a5e0f08016306b6bf3
    })
})
router.post('/projects/delete',async(req,res)=>{

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
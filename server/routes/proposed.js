const express=require('express')
const auth=require('../middleware/auth')
const router=new express.Router()
const Project=require('../models/project')
const Student=require('../models/student')
const Teacher=require('../models/teacher')




router.get('/proposed/allProposedProjects',auth,async(req,res)=>{

    const role=req.session.role
    try{

        const projects=await Project.find({ ownerRole:'teacher' })
        
        if(role=="student"){
            
            return  res.render('proposed/allProposedProjects',{
                title:'Projects',
                Projects:true,
                studentLogin:true,
                project:projects,
                success:req.flash('success')
            })

        }
        else if(role=="teacher"){

            return res.render('proposed/allProposedProjects',{
                title:'Projects',
                Projects:true,
                teacherLogin:true,
                project:projects,
                success:req.flash('success')
            })

        }


    }catch(e){
        console.log(e)
    }

})



router.get('/proposed',auth,async(req,res)=>{
    const role=req.session.role
    const email=req.session.email
    try{
        
        if(role=='student'){
            const std=await Student.findOne({ email })
           
            if(!std){
               return res.redirect('/')
            } 
            
            await std.populate('projects').execPopulate() 
            
            return  res.render('proposed/selfproposedProjects',{
                title:'Projects',
                Projects:true,
                studentLogin:'true',
                project:std.projects,
                success:req.flash('success')
            })
        }
        else if(role=='teacher'){
            const teach=await Teacher.findOne({email})
            
            if(!teach){
               return res.redirect('/')
            } 
            
            await teach.populate('projects').execPopulate() 
            
            return res.render('proposed/selfproposedProjects',{
                title:'Projects',
                Projects:true,
                teacherLogin:'true',
                project:teach.projects,
                success:req.flash('success')
            })
        }

    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})



router.get('/proposed/proposeNewProject',auth,async(req,res)=>{
    const role=req.session.role
    const email=req.session.email
    try{
        if(role=="student"){
            
            const std=await Student.findOne({email})
            if(!std){
                return res.redirect('/')
            }

            return res.render('proposed/proposeNewProject',{
                title:'projects',
                studentLogin:'true',
                Projects:true,
                ownerName:std.name,
                ownerEmail:std.email,
                ownerRole:role
            })

        }else if(role=="teacher"){
            
            const teach=await Teacher.findOne({email})
            if(!teach){
                return res.redirect('/')
            }

            return res.render('proposed/proposeNewProject',{
                title:'projects',
                teacherLogin:'true',
                Projects:true,
                ownerName:teach.name,
                ownerEmail:teach.email,
                ownerRole:role
            })
        }
    }catch(e){
        console.log(e)
        res.redirect('/')
    }

})

router.post('/proposed/proposeNewProject',auth,async(req,res)=>{
    const project=new Project(req.body)
    const role=req.session.role

    project.ownerRole=role
    project.status='proposed'
    
    try{
        await project.save()
        console.log("project saves successfully")
        req.flash('success','Projectd Created Successfully')
        res.redirect('/proposed')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})


router.post('/projects/requestProject/:id',auth,async(req,res)=>{
    
    const id = req.params.id
    const email=req.session.email
    try
    {
        const student = await Student.find({ email })
        var query = {_id: id};
        
            Project.findOneAndUpdate(query, {request:'pending', requestedByID:student.id }, {upsert: true}, function(err, doc) {
            if (err) return console.log('500, {error: err}');
            return console.log('Succesfully saved.');
            });

        console.log('project up')
        return
    }catch(e){
        console.log(e.message)
        req.flash('error','something went wrong please try again')
        res.redirect('/')
    }

})


module.exports=router
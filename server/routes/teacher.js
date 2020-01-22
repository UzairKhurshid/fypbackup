const express=require('express')
const auth=require('../middleware/auth')
const router=new express.Router()
const Teacher=require('../models/teacher')


router.get('/teachers',auth, async (req, res)=> {
    try{
        const teachers=await Teacher.find()
        
        res.render('teachers/index',{
            title:'Teachers',
            Teachers:true,
            teacher:teachers,
            success:req.flash('success')
        })
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
  })





router.get('/teachers/create',auth, async (req, res)=> {
    res.render('teachers/create',{
        Teachers:true,
        title:'Teachers'
    })
    console.log(req.session.working)
  })

router.post('/teachers/create',auth,async(req,res)=>{
    const teachers=new Teacher(req.body)
    
    try{
        await teachers.save()
        console.log("teacher saves successfully")
        req.flash('success','Teacher Updated Successfully')
        res.redirect('/Teachers')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})





router.get('/teachers/update/:id',auth,async(req,res)=>{
    try{
        const id = req.params.id 
        const std=await Teacher.findOne({_id:id})
        res.render('teachers/update',{
            Teachers:true,
            teacher:std,
            title:'Teachers',
            success:req.flash('success')
        })
    }
    catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.post('/teachers/update/:id',auth,async(req,res)=>{
    
    const updates=Object.keys(req.body)
    const id = req.params.id 
    
    try{

        const teacher=await Teacher.findOne({_id:id})
        if(!req.body.password){
            req.body.password=teacher.password
        }
        

        updates.forEach((update) => teacher[update] = req.body[update] )
        await teacher.save()

        console.log("Updated SUccessfully")
        req.flash('success','Teacher Updated Successfully')

       res.redirect('/teachers/update/'+id)

    } catch(e){
        console.log(e)
        res.redirect('/')
    }  
})





router.get('/teachers/delete',auth,(req,res)=>{
    res.render('teachers/delete',{
        Teachers:true,
        title:'Teachers'
    })
})
router.post('/teachers/delete',auth,async(req,res)=>{
     
    const regNo=req.body.regNo
    
    try{

        await Teacher.findOneAndDelete({regNo})
        console.log("deleted Successfully")
        
        const teachers=await Teacher.find()
        res.render('teachers/index',{
            title:'Teachers',
            teacher:teachers
        })

    } catch(e){
        console.log(e)
        res.redirect('/')
    }
})

module.exports=router
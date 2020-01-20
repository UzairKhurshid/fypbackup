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
            teacher:teachers
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
        res.redirect('/Teachers/create')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})





router.get('/teachers/update',auth,(req,res)=>{
    res.render('teachers/update',{
        Teachers:true,
        title:'Teachers'
    })
})
router.post('/teachers/update',auth,async(req,res)=>{
    
    const updates=Object.keys(req.body)
    const regNo=req.body.regNo
    
    try{

        const teacher=await Teacher.findOne({regNo})
        if(!req.body.password){
            req.body.password=teacher.password
        }
        

        updates.forEach((update) => teacher[update] = req.body[update] )
        await teacher.save()

        console.log("Updated SUccessfully")
        const teachers=await Teacher.find()
        res.render('teachers/index',{
            title:'Teacger',
            teacher:teachers
        })

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
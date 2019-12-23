const express=require('express')
const router=new express.Router()
const Teacher=require('../models/teacher')


router.get('/teachers', async (req, res)=> {
    try{
        const teachers=await Teacher.find()
        
        res.render('teachers/index',{
            title:'Teachers',
<<<<<<< HEAD
=======
            Teachers:true,
>>>>>>> 86c187c04ea3eba36c3f00a5e0f08016306b6bf3
            teacher:teachers
        })
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
  })





router.get('/teachers/create', async (req, res)=> {
    res.render('teachers/create',{
<<<<<<< HEAD
=======
        Teachers:true,
>>>>>>> 86c187c04ea3eba36c3f00a5e0f08016306b6bf3
        title:'Teachers'
    })
    console.log(req.session.working)
  })

router.post('/teachers/create',async(req,res)=>{
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





router.get('/teachers/update',(req,res)=>{
    res.render('teachers/update',{
<<<<<<< HEAD
=======
        Teachers:true,
>>>>>>> 86c187c04ea3eba36c3f00a5e0f08016306b6bf3
        title:'Teachers'
    })
})
router.post('/teachers/update',async(req,res)=>{
    
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





router.get('/teachers/delete',(req,res)=>{
    res.render('teachers/delete',{
<<<<<<< HEAD
=======
        Teachers:true,
>>>>>>> 86c187c04ea3eba36c3f00a5e0f08016306b6bf3
        title:'Teachers'
    })
})
router.post('/teachers/delete',async(req,res)=>{
     
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
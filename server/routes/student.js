const express=require('express')
const auth=require('../middleware/auth')
const router=new express.Router()
const Student=require('../models/student')


router.get('/admin/students',auth, async (req, res)=> {
    try{
        const students=await Student.find()
        
        res.render('students/index',{
            title:'Students',
            Students:true,
            student:students, 
            adminLogin:'true',
            success:req.flash('success')
        })
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
  })



router.get('/admin/students/create',auth, async (req, res)=> {
    res.render('students/create',{
        Students:true,
        adminLogin:'true',
        title:'Students'
    })
  })

router.post('/admin/students/create',auth,async(req,res)=>{
    const student=new Student(req.body)
    
    try{
        await student.save()
        console.log("student saves successfully")
        req.flash('success','Student Created Successfully')
        res.redirect('/admin/students')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})


router.get('/admin/students/update/:id',auth,async (req,res)=>{
    try{
        const id = req.params.id 
        const std=await Student.findOne({_id:id})
        res.render('students/update',{
            Students:true,
            student:std,
            adminLogin:'true',
            title:'Students',
            success:req.flash('success')

        })
    }
    catch(e){
        console.log(e)
        res.redirect('/')
    }
  
})

router.post('/admin/students/update/:id',auth,async(req,res)=>{
    
    const updates=Object.keys(req.body)
    const id = req.params.id
    try{

        const student=await Student.findOne({_id:id})
        if(!req.body.password){
            req.body.password=student.password
        }

        updates.forEach((update) => student[update] = req.body[update] )
        await student.save()

        console.log("Updated SUccessfully")
        req.flash('success','Student Updated Successfully')
        res.redirect('/admin/students/update/'+id)

    } catch(e){
        console.log(e)
        res.redirect('/')
    } 
}) 


router.get('/admin/students/delete',auth,(req,res)=>{
    res.render('students/delete',{
        Students:true,
        adminLogin:'true',
        title:'Students'
    })
})
router.post('/admin/students/delete/:id',auth,async(req,res)=>{

    const id=req.params.id
    
    try{
        await Student.findOneAndDelete({_id:id})
        console.log("deleted Successfully")
        req.flash('success','Student Deleted Successfully')
       res.redirect('/admin/students')


    } catch(e){
        console.log(e)
        res.redirect('/')
    }
})


module.exports=router
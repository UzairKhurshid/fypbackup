const express=require('express')
const auth=require('../middleware/auth')
const router=new express.Router()
const Student=require('../models/student')


router.get('/students',auth, async (req, res)=> {
    try{
        const students=await Student.find()
        
        res.render('students/index',{
            title:'Students',
            Students:true,
            student:students
        })
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
  })





router.get('/students/create',auth, async (req, res)=> {
    res.render('students/create',{
        Students:true,
        title:'Students'
    })
    console.log(req.session.working)
  })

router.post('/students/create',auth,async(req,res)=>{
    const student=new Student(req.body)
    
    try{
        await student.save()
        console.log("student saves successfully")
        res.redirect('/students/create')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})




router.get('/students/update',auth,(req,res)=>{
    res.render('students/update',{
        Students:true,
        title:'Students'
    })
})
router.post('/students/update',auth,async(req,res)=>{
    
    const updates=Object.keys(req.body)
    const regNo=req.body.regNo

    try{

        const student=await Student.findOne({regNo})
        if(!req.body.password){
            req.body.password=student.password
        }

        updates.forEach((update) => student[update] = req.body[update] )
        await student.save()

        console.log("Updated SUccessfully")
        const students=await Student.find()
        res.render('students/index',{
            title:'Students',
            student:students
        })

    } catch(e){
        console.log(e)
        res.redirect('/')
    } 
})





router.get('/students/delete',auth,(req,res)=>{
    res.render('students/delete',{
        Students:true,
        title:'Students'
    })
})
router.post('/students/delete',auth,async(req,res)=>{

    const regNo=req.body.regNo
    
    try{
        await Student.findOneAndDelete({regNo})
        console.log("deleted Successfully")

        const students=await Student.find()
        res.render('students/index',{
            title:'Students',
            student:students
        })


    } catch(e){
        console.log(e)
        res.redirect('/')
    }
})


module.exports=router
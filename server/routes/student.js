const express=require('express')
const router=new express.Router()
const Student=require('../models/student')


router.get('/students', async (req, res)=> {
    try{
        const students=await Student.find()
        
        res.render('students/index',{
            title:'Students',
<<<<<<< HEAD
=======
            Students:true,
>>>>>>> 86c187c04ea3eba36c3f00a5e0f08016306b6bf3
            student:students
        })
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
  })





router.get('/students/create', async (req, res)=> {
    res.render('students/create',{
<<<<<<< HEAD
=======
        Students:true,
>>>>>>> 86c187c04ea3eba36c3f00a5e0f08016306b6bf3
        title:'Students'
    })
    console.log(req.session.working)
  })

router.post('/students/create',async(req,res)=>{
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




router.get('/students/update',(req,res)=>{
    res.render('students/update',{
<<<<<<< HEAD
=======
        Students:true,
>>>>>>> 86c187c04ea3eba36c3f00a5e0f08016306b6bf3
        title:'Students'
    })
})
router.post('/students/update',async(req,res)=>{
    
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





router.get('/students/delete',(req,res)=>{
    res.render('students/delete',{
<<<<<<< HEAD
=======
        Students:true,
>>>>>>> 86c187c04ea3eba36c3f00a5e0f08016306b6bf3
        title:'Students'
    })
})
router.post('/students/delete',async(req,res)=>{

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
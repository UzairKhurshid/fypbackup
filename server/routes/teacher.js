const express=require('express')
const auth=require('../middleware/auth')
const router=new express.Router()
const Teacher=require('../models/teacher')


router.get('/admin/teachers',auth, async (req, res)=> {
    try{
        const teachers=await Teacher.find()
        
        res.render('teachers/index',{
            title:'Teachers',
            Teachers:true,
            adminLogin:'true',
            teacher:teachers,
            success:req.flash('success')
        })
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
  })





router.get('/admin/teachers/create',auth, async (req, res)=> {
    res.render('teachers/create',{
        Teachers:true,
        adminLogin:'true',
        title:'Teachers'
    })
    console.log(req.session.working)
  })

router.post('/admin/teachers/create',auth,async(req,res)=>{
    const teachers=new Teacher(req.body)
    
    try{
        await teachers.save()
        console.log("teacher saves successfully")
        req.flash('success','Teacher Updated Successfully')
        res.redirect('/admin/Teachers')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})





router.get('/admin/teachers/update/:id',auth,async(req,res)=>{
    try{
        const id = req.params.id 
        const std=await Teacher.findOne({_id:id})
        let status=false
        if(std.status=='enable'){
            status=true
        }
        res.render('teachers/update',{
            Teachers:true,
            teacher:std,
            adminLogin:'true',
            title:'Teachers',
            status:status,
            success:req.flash('success')
        })
    }
    catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.post('/admin/teachers/update/:id',auth,async(req,res)=>{
    
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

       res.redirect('/admin/teachers/update/'+id)

    } catch(e){
        console.log(e)
        res.redirect('/')
    }  
})





router.get('/admin/teachers/delete/:id',auth,(req,res)=>{
    res.render('teachers/delete',{
        Teachers:true,
        adminLogin:'true',
        title:'Teachers'
    })
})
router.post('/admin/teachers/delete/:id',auth,async(req,res)=>{
     
    const id=req.params.id
    
    
    try{

        await Teacher.findOneAndDelete({_id:id})
        console.log("deleted Successfully")
        req.flash('success','Teacher Deleted Successfully')
       res.redirect('/admin/teachers')


    } catch(e){
        console.log(e)
        res.redirect('/')
    }
})

module.exports=router
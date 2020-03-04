const express=require('express')
const auth=require('../middleware/auth')
const router=new express.Router()
const Admin=require('../models/admin')
const Student=require('../models/student')
const Teacher=require('../models/teacher')


router.get('/admin/admins',auth, async (req, res)=> {
    try{
        const admins=await Admin.find()
        
        res.render('admins/index',{
            title:'Admins',
            Admins:true,
            admin:admins,
            adminLogin:'true',
            success:req.flash('success')
        })
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
  })



router.get('/admin/admins/create',auth, async (req, res)=> {
    res.render('admins/create',{
        Admins:true,
        adminLogin:'true',
        title:'Admins'
    })
  })

router.post('/admin/admins/create',auth,async(req,res)=>{
     const admin=new Admin(req.body)
    // admin.regNo='12563'
    // admin.name='uzair'
    // admin.email='uzair12@gmail.com'
    // admin.password='uzair123'
    try{
        await admin.save()
        console.log("student saves successfully")
        req.flash('success','Student Created Successfully')
        res.redirect('/admin/admins')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})


router.get('/admin/admins/update/:id',auth,async (req,res)=>{
    try{
        const id = req.params.id 
        const ad=await Admin.findOne({_id:id})
        res.render('admins/update',{
            Admins:true,
            admin:ad,
            adminLogin:'true',
            title:'Admins',
            success:req.flash('success')

        })
    }
    catch(e){
        console.log(e)
        res.redirect('/')
    }
  
})

router.post('/admin/admins/update/:id',auth,async(req,res)=>{
    
    const updates=Object.keys(req.body)
    const id = req.params.id
    try{

        const admin=await Admin.findOne({_id:id})
        if(!req.body.password){
            req.body.password=admin.password
        }

        updates.forEach((update) => admin[update] = req.body[update] )
        await admin.save()

        console.log("Updated SUccessfully")
        req.flash('success','Admin Updated Successfully')
        res.redirect('/admin/admins/update/'+id)

    } catch(e){
        console.log(e)
        res.redirect('/')
    } 
})


router.get('/admin/admins/delete',auth,(req,res)=>{
    res.render('admins/delete',{
        Admins:true,
        adminLogin:'true',
        title:'Admins'
    })
})
router.post('/admin/admins/delete/:id',auth,async(req,res)=>{

    const id=req.params.id
    
    try{
        await Admin.findOneAndDelete({_id:id})
        console.log("deleted Successfully")
        req.flash('success','Admin Deleted Successfully')
       res.redirect('/admin/admins')


    } catch(e){
        console.log(e)
        res.redirect('/')
    }
})


module.exports=router
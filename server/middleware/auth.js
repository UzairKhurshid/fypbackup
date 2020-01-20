const auth=async (req,res,next)=>{

    if(!req.session.email){
        return res.render('auth/login',{
            title:'Login', 
            layout: 'layouts/auth'
        })
    }
    console.log(req.session.role)
    console.log(req.session.email)
    next()
}

module.exports=auth
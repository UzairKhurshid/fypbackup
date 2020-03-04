const auth=async (req,res,next)=>{

    if(!req.session.email){
        return res.redirect('/login')
    }
    console.log(req.session.role)
    console.log(req.session.email)
    next()
}

module.exports=auth
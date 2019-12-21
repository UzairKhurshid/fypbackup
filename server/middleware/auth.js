const auth=async (req,res,next)=>{

    if(!req.session.email){
        return res.redirect('/')
    }
    console.log(req.session.email)
    next()
}

module.exports=auth
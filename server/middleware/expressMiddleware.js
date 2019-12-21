const express=require('express')
const app=express()


//this express middleware with free arguments runs for every request and set csrf token value
// app.use((req,res,next) => {
//     res.locals.csrfToken=req.csrfToken()
//     console.log("req.csrfToken is logging")
//     next()
// })


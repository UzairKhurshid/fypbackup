const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const projectSchema=new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required:true
    },
    language:{
        type:String,
        trim: true,
        required:true
    },
    IDE:{
        type:String,
        trim: true,
        required:true
    },
    type:{
        type:String,
        trim: true,
        required:true
    },
    department:{
        type:String,
        trim: true,
        required:true
    },
    semester:{
        type:String,
        trim: true,
        required:true
    },
    year:{
        type:Number,
        trim: true,
        required:true
    },
    description:{
        type:String,
        trim: true,
        required:true
    },
    ownerName:{
        type:String,
        trim: true,
        ref:'Student',
        ref:'Teacher'
    },
    ownerEmail:{
        type:String,
        trim: true,
        ref:'Student',
        ref:'Teacher'
    },
    ownerRole:{
        type:String,
        required:true,
        trim: true
    },
    status:{
        type:String,
        required:true,
        trim: true
    },
    request:{
        type:String,
        trim: true
    },
    requestedByID:{
        type:String,
        trim: true,
        ref:'Student'
    }

},
{ 
   timestamps: true
})


const Project=mongoose.model('Project',projectSchema)
module.exports=Project
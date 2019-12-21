const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const projectSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    IDE:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    semester:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},
{ 
   timestamps: true
})


const Project=mongoose.model('Project',projectSchema)
module.exports=Project
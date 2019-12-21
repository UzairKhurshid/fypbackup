const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const teacherSchema=new mongoose.Schema({
    regNo:{
        type:Number,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,  
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('not a valid email')
            }
        }
    },
    campus:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},
{ 
   timestamps: true
})

teacherSchema.pre('save',async function(next){
    const teacher=this

    if(teacher.isModified('password')){
        teacher.password=await bcrypt.hash(teacher.password,8)
        }

    next()
})

const Teacher=mongoose.model('Teacher',teacherSchema)
module.exports=Teacher
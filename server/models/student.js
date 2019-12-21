const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const studentSchema=new mongoose.Schema({
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
    phone:{
        type:String,
        required:true
    },
    campus:{
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
    password:{
        type:String,
        required:true
    }
},
{ 
   timestamps: true
})

studentSchema.pre('save',async function(next){
    const student=this

    if(student.isModified('password')){
        student.password=await bcrypt.hash(student.password,8)
        }

    next()
})

const Student=mongoose.model('Student',studentSchema)
module.exports=Student
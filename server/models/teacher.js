const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const teacherSchema=new mongoose.Schema({
    regNo:{
        type:Number,
        required:true,
        trim: true,
        unique:true
    },
    name:{
        type:String,
        trim: true,
        required:true
    },
    gender:{
        type:String,
        trim: true,
        required:true
    },
    email:{
        type:String,
        trim: true,
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
        trim: true,
        required:true
    },
    department:{
        type:String,
        trim: true,
        required:true
    },
    password:{
        type:String,
        trim: true,
        required:true
    },
    status:{
        type:String,
        trim: true,
        required:true
    }
},
{ 
   timestamps: true
})


teacherSchema.virtual('projects',{
    ref:'Project',
    localField:'email',
    foreignField:'ownerEmail' 
})


teacherSchema.statics.findByCredentionals = async(email,password)=>{
    const teacher=await Teacher.findOne({email})
    
    if(!teacher){
        throw new Error('Invalid Email')
    }
    const chkPass=await bcrypt.compare(password,teacher.password)
    if(!chkPass){
        throw new Error('Invalid Password')
    }

    if(teacher.status == 'disable'){
        throw new Error('Account is not Active Yet')
    }
 
    return teacher
}


teacherSchema.pre('save',async function(next){
    const teacher=this

    if(teacher.isModified('password')){
        teacher.password=await bcrypt.hash(teacher.password,8)
        }

    next()
})

const Teacher=mongoose.model('Teacher',teacherSchema)
module.exports=Teacher
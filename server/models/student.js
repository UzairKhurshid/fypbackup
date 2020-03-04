const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const studentSchema=new mongoose.Schema({
    
    name:{
        type:String,
        trim: true,
        required:true
    },
    regNo:{
        type:Number,
        trim: true,
        required:true,
        unique:true
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
    semester:{
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

studentSchema.virtual('projects',{
    ref:'Project',
    localField:'email',
    foreignField:'ownerEmail' 
})

studentSchema.virtual('requestProject',{
    ref:'Project',
    localField:'regNo',
    foreignField:'requestedByID' 
})

 
studentSchema.statics.findByCredentionals =async (email,password)=>{
    const student=await Student.findOne({email})
    
    if(!student){
        throw new Error('Invalid Email');
    }
    const chkPass=await bcrypt.compare(password,student.password)
    if(!chkPass){
        throw new Error('Invalid Password');
    }
    if(student.status == 'disable'){
        throw new Error('Account is not Active Yet')
    }

    return student 
}

studentSchema.pre('save',async function(next){
    const student=this

    if(student.isModified('password')){
        student.password=await bcrypt.hash(student.password,8)
        }

    next()
})


const Student=mongoose.model('Student',studentSchema)
module.exports=Student
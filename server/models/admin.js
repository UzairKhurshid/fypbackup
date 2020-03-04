const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const adminSchema=new mongoose.Schema({
     
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
    password:{
        type:String,
        trim: true,
        required:true
    }
},
{ 
   timestamps: true
})

 
adminSchema.statics.findByCredentionals =async (email,password)=>{
    const admin=await Admin.findOne({email})
    if(!admin){
        console.log("Error1")
        throw new Error('Invalid Email');
    }
    const chkPass=await bcrypt.compare(password,admin.password)
    if(!chkPass){
        console.log("Error2")
        throw new Error('Invalid Password');
    }
    return admin
}

adminSchema.pre('save',async function(next){
    const admin=this

    if(admin.isModified('password')){
        admin.password=await bcrypt.hash(admin.password,8)
        }

    next()
})


const Admin=mongoose.model('Admin',adminSchema)
module.exports=Admin
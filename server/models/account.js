const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const accountSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true
    },
    regNo: {
        type: Number,
        trim: true,
        unique: true
    },
    role: {
        type: String,
        trim: true,
        required: true
    },
    gender: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email isnt Valid')
            }
        }
    },
    campus: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        trim: true
    },
    semester: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        trim: true,
        required: true
    },
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})


//*********Virtuals For My Project *********** */
accountSchema.virtual('myProjectOwnerEmail', {
    ref: 'myProject',
    localField: 'email',
    foreignField: 'ownerEmail'
})

accountSchema.virtual('myProjectRequestedByEmail', {
    ref: 'myProject',
    localField: 'email',
    foreignField: 'requestedByEmail'
})

//*********Virtuals For  Project *********** */

accountSchema.virtual('projects', {
    ref: 'Project',
    localField: 'email',
    foreignField: 'ownerEmail'
})

//*********Virtuals For Request *********** */

accountSchema.virtual('requestToProject', {
    ref: 'Request',
    localField: 'email',
    foreignField: 'ownerEmail'
})

accountSchema.virtual('requestedByProject', {
    ref: 'Request',
    localField: 'email',
    foreignField: 'requestedByEmail'
})

//*********Virtuals For Notification *********** */

accountSchema.virtual('notificationOwner', {
    ref: 'Notification',
    localField: 'email',
    foreignField: 'ownerEmail'
})


accountSchema.statics.findByCredentionals = async(email, password, role) => {
    const account = await Account.findOne({ email, role })

    if (!account) {
        throw new Error('Invalid Email');
    }

    const chkPass = await bcrypt.compare(password, account.password)
    if (!chkPass) {
        throw new Error('Invalid Password');
    }
    if (account.status == 'disable') {
        throw new Error('Account is not Active Yet')
    }

    return account
}

accountSchema.pre('save', async function(next) {
    const account = this

    if (account.isModified('password')) {
        account.password = await bcrypt.hash(account.password, 8)
    }

    next()
})


const Account = mongoose.model('Account', accountSchema)
module.exports = Account
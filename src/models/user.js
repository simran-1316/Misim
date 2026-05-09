const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema( {
    firstName:{
        type:String,
        required:true,
        index:true      // helps to find users easily MongoDB creates a special fast lookup structure internally.
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true,         // email should be unique automatically indexing applied
        lowercase:true,      // ye apne aap email ko lowecase mein save kar lega
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please write a valid email")
            }
        }
    },
    age:{
        type:Number
        //min:8,//max:50 - for number
    },
    password:{
        type:String
        //minlength:8,maxlength:12 - for string
    },
    gender:{
        type:String,        // naye data ke liye valid h not for updating old data
        validate(value){
            if(!['male','female','others'].includes(value)){
                throw new Error('Please write a valid gender value')
            }
        }
    },
    profileurl:{
        type: String,
        default:"https://static.vecteezy.com/system/resources/previews/036/280/650/large_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",

    },
    skills:{        //["Cooking", "Js"]
        type:[String]
    }
},{
    timestamps:true
})
const User=mongoose.model('User',userSchema)    // 'User' - always capital
module.exports=User
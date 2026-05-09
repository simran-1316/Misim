const express=require('express')
const authRouter=express.Router()
const bcrypt=require('bcrypt')
const User=require('../models/user')
const {validateSignUpData}=require('../utils/validateSignUpData')
const {userAuth}=require('../middleware/auth')
const jwt=require('jsonwebtoken')

authRouter.post('/signup', async (req, res) => {

    // Validate the data in req.body
    validateSignUpData(req)
    // Encrypt the password
    const { password, firstName, lastName, email } = req.body

    // const passwordHash= await bcypt.hash(myPlaintextPassword,saltRounds)
    const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({ firstName, lastName, email, password: passwordHash });  // ham apne data ko save karenge Instance of the model

    try {
        await user.save();
        res.send({message:'User created sucessfully'})

    } catch (err) {
        res.status(400).send({ errorMessage: 'Something went wrong!', err });

    }
})

 authRouter.post("/login", async function (req, res) {
    try {
        const {email, password } = req.body
        
        const user = await User.findOne({ email: email.toLowerCase() }) // we find the email entered if it's present if it's present we compare the password
       
        if (!user) {
            throw new Error("Invalid User")
        }
        const isPassword = await bcrypt.compare(password, user.password)
         
        if (isPassword) {
            // Create JWT token
            const token = await jwt.sign(
                { _id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'}
            )
            
            // Add the token to the cookie and send it as a response
            res.cookie("token",token )
            res.send("Login Successfull")
        } else {
            throw new Error("Invalid Password")
        }
    } catch (err) {
        res.status(400).send({ errorMessage: "Something went wrong!", err })
    }
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())})
    res.send("User Logged Out Successfully")
})

module.exports=authRouter

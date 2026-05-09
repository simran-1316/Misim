const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require('../middleware/auth');

const {validateEditProfileData} =require('../utils/validateEditProfileData')
const jwt = require('jsonwebtoken');   // because YOU are verifying token here

profileRouter.get('/profile/view', userAuth,async (req, res) => {
    try {
        const user=req.user
        res.send({message:"User Data Fetched Successfully",user})
    } catch (err) {
        res.status(400).send({ errorMessage: "Something went wrong!", err })
    }
})
profileRouter.patch("/profile/edit",userAuth,async(req,res)=> {
    try{
        if(!validateEditProfileData(req)){  // validate the edit request
            throw new Error("Invalid Edit Request")
        }
const loggedUser = req.user       // get the user 

Object.keys(req.body).forEach(key=>loggedUser[key] = req.body[key])     // wrap the keys coming from frontend to get updated 
await loggedUser.save()
res.send({message:`${loggedUser.firstName},Your data has been updated successfully`,updatedData: {loggedUser}}) 

    }
    catch(err){
        res.status(400).send({errorMessage:"Something went wrong!",err})
    }
})
module.exports = profileRouter;
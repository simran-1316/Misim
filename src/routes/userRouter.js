const express = require('express')
const userRouter = express.Router()
const { userAuth } = require('../middleware/auth')
const ConnectionRequestModel = require('../models/connectionRequest')

userRouter.get('/user/requests/received',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:'interested'
        }).populate("fromUserId","firstName lastName age profileurl")   //used to replace ObjectId with actual data from the referenced collection.
       
        res.json({
            message:"Data fetched Successfully",
            data: connectionRequests
        })
    }catch(err){
       res.status(400).send("Error: "+ err.message);
    }

})
userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"}, // People who sent request TO me and I accepted
                {fromUserId:loggedInUser._id,status:"accepted"} // People I sent request TO and they accepted
            ]   //Find ALL accepted connections involving me
        }).populate("fromUserId","firstName lastName age profileurl")
        .populate("toUserId","firstName lastName age profileurl")
        res.send(connectionRequests)

    }catch(err){
        res.status(400).send("Error: "+ err.message)
    }
})

module.exports=userRouter;
const express=require('express')
const { userAuth } = require('../middleware/auth')
const ConnectionRequestModel = require('../models/connectionRequest')
const requestRouter=express.Router()


requestRouter.post('/request/send/:status/:userId',userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id
        const toUserId = req.params.userId    // It stores dynamic parts of the route (like status and userId from URL)
        const status = req.params.status
        const allowedStatus=['ignored','interested']    //Only these statuses are allowed when sending a request
        if(!allowedStatus.includes(status)){        // If status is NOT valid…
            return res.status(400).json({message:'Invalid Status Request'})
            //Send response in JSON format
        }
        const existingConnectionRequest=await ConnectionRequestModel.findOne({  // model method
            $or:[       //If ANY condition matches 1. check if A → B already exits,2. check reverse request B → A 
                {fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
       
        if(existingConnectionRequest){
            return res.status(400).send({message:'Connection request already exists'})
        }
        const ConnectionRequest = new ConnectionRequestModel({  // create a document
            fromUserId,toUserId,status
        })
     
        const data = await ConnectionRequest.save()    // store it in database object/doucment method
        res.send({ message:`Connection request ${status} successfully`,
   data})

    }catch(err){
        res.status(400).send({message: err.message})
       
    }
  
})
requestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user
        const{status,requestId} = req.params
        const allowedStatus = ['accepted','rejected'] // interested ke baad 2 options honge accepted or rejected
        // Rohit sent reques to Virat
        // Is status interested 
        // requestId valid ?
        console.log(loggedInUser._id)
        console.log(status,requestId)
        
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Status Not Allowed"})
        }
        const connectionRequest = await ConnectionRequestModel.findOne({
            _id:requestId,      //Find THIS SPECIFIC connection request AND ensure logged-in user is receiver
            status:'interested'
        })
        console.log(connectionRequest)
        if(!connectionRequest){
            return res.status(404).json({message:"Connection request Not Found"})
        }
        connectionRequest.status = status
        const data = await connectionRequest.save()
        console.log(data)
        res.json({message:"Connection request",status,data})

    }catch(err){
        res.status(400).send({message:"Connection request not sent",err})
    }
})
module.exports=requestRouter;
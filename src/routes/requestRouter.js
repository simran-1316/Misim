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

module.exports=requestRouter;
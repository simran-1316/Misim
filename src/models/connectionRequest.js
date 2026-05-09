const mongoose = require('mongoose')
const ConnectionRequestSchema = new mongoose.Schema({
fromUserId:{
    type:mongoose.Schema.Types.ObjectId,    //store the _id of some other document here (like a User)
    required:true
},
toUserId:{      //the user who is receiving the request
    type:mongoose.Schema.Types.ObjectId,
    required:true
},
status:{            //tells current state of the request
    type:String,
    required:true,
    enum:{      //Restricts allowed values Status can ONLY be one of these 4 values
        values:["ignored","interested","accepted","rejected"],
        message:`{Value} is incorrect status type`
    }
}

},{
    timestamps:true// time bhi store karta rahega
})
ConnectionRequestSchema.pre('save',function(next){  //Before saving a connection request, check something first.
    const ConnectionRequest = this;     // the current document being saved
    if(ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)){
        throw new Error('Cannot send request to  yourself!!')
    }

})

// Create a model using this schema so I can interact with the database
const ConnectionRequestModel = new mongoose.model('ConnectionRequest',ConnectionRequestSchema)
module.exports=ConnectionRequestModel
const express = require('express')      // express ko leke aa rahe h                                        

const app = express()                   // server create ho raha

app.use('/', (req, res) => {               // request 
    res.send("I am running Express js")
})  // call back function is known is route  handler
app.listen(3000, () => {
    console.log("Server Connected on the PORT Successfully");
})
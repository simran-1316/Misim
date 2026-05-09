const express = require('express');
const app = express();

const { connectDB } = require('./database/connection');

app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const authRouter = require('./routes/authRouter');
const profileRouter = require('./routes/profileRouter');
const requestRouter = require('./routes/requestRouter');

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)
connectDB()
    .then(() => {
        console.log("Databse Connection established")
        app.listen(7000, () => {
            console.log('Server is running on PORT 7000');
        })
    })
    .catch(err => console.log("Database Connection is NOT established"))

// require se jo database/connection h vo file ek function mein wrap hoti h and then envoke/call hoti h
// ( function (){
//          fxn Logic here
// })() - immediatley invoked function

// the problem - if before the connection of database with backend we listen to the requests
// then ofcourse it will fail so it's important that database connection should be established first

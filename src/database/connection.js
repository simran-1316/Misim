const mongoose = require('mongoose');
const dotenv=require('dotenv')

// const url = 'mongodb+srv://pregradStudent_db_user:Rawat@123456@pregrad.bevshzj.mongodb.net/?appName=Pregrad'
// cluster - database - (multiple collections) connections
dotenv.config()
const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
}

module.exports = { connectDB };

// jab koi account bana raha tha backend ko request gyi and data save ho gyi 
// login krte huye jwt token create hoga cookie mein(long string) frontend mein save hoga 
// jab bhi vo token jayega request se vo validate kraega tabhi saari request ho kar payega
// token ki expiry hoti h tabhi connection timeout ho jata h and ham logout ho jate h
// const connectioreud = new mongoose.Schema
// 
// 
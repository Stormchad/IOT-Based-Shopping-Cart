const mongoose = require('mongoose')

const connectDB = () =>{
    const conn = mongoose.connect(process.env.MONGO_URI,{

        useNewUrlParser:true,
        useUnifiedTopology:true,
        autoIndex: false

        })
    console.log(`MongoDB connected`)
}

module.exports = { connectDB }

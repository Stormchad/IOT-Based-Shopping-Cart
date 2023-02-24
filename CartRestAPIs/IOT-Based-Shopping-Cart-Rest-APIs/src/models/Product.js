const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

    productName:{
        type:String,
        required:true
    },
    productPrice:{
        type:Number,
        required:true,
    },
    productCode:{
        type:String,
        required:true,
        unique:true
    }

},
{
    timestamps:true
}
)

const Product =  mongoose.model("Product",productSchema)

module.exports = Product
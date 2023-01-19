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

module.exports = mongoose.model("product",productSchema)
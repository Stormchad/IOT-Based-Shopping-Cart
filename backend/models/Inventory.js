const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({

    productCode:{
        type: String,
        required:true
    }
    ,
    quantity:{
        type:Number,
        required:true
    }
},
{
    timestamps:true
}
)

module.exports = mongoose.model("inventory",inventorySchema)
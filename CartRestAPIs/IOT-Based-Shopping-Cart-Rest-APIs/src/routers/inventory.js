const express = require('express')
const User = require('../models/user')
const Cart = require('../models/cart')
const Inventory = require('../models/Inventory')
const Product = require('../models/Product')
const auth = require('../middleware/verifyToken')
const router = new express.Router()


//update inventory for a product
router.post('/admin/inventory/', async (req, res) => {

    const productCode = req.body.productCode
    const q = req.body.quantity

    if(productCode == null || productCode == "")
    {
        res.status(400).send({message:"Please enter productCode"})
    }
    else if(q == null)
    {
        res.status(400).send({message:"Please enter quantity"})
    }
    else
    {
        try
        {
            const product = await Product.findOne({ productCode })
            const inventory = await Inventory.findOne({ productCode })
        
            if(!product)
            {
              res.status(400).send({message:"Product not found - Try creating the product first"})   
            }
            else if(inventory)
            {
              const inventory1 = await Inventory.findOneAndUpdate({productCode},{quantity:q}) 
              res.status(200).send({message: "SUCCESS", inventory1})
            }
            else
            {
              var i1 = new Inventory ({productCode:productCodeToFind, quantity:q})
              await i1.save()
              res.status(200).send({message: "SUCCESS", i1})
        
            }
        }   
        catch(e)
        {
             res.status(500).send({message:"Error occurred",e})   
        } 
    }

})

//get inventory by productCode
router.get('/admin/inventory/', async ( req, res ) => {
    
    productCode = req.body.productCode

    if(productCode == null || productCode == "")
    {
        res.status(400).send({message:"Please enter a product code"})
    }
    else
    {
        try
        {
            const inventory = await Inventory.findOne({productCode})
            res.status(200).send({inventory})
        }
        catch(e)
        {
            res.status(500).send({message:"Error occurred",e})
        }
        

    }
})

router.get('/admin/inventory/all', async (req , res) => {

    try
    {
        const inventory = await Inventory.find()
        res.status(200).send(inventory)
    }
    catch(e)
    {
        res.status(500).send({message:"Error occurred",e})
    }
    

})


module.exports = router
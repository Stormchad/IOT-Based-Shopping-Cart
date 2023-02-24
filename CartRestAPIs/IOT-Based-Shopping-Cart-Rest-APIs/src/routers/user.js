  const express = require('express')
const User = require('../models/user')
const Cart = require('../models/cart')
const auth = require('../middleware/auth')
const router = new express.Router()

const generateSpecialCode = () =>{

    return Math.random().toString(36).slice(2, 7);
  
}
  

//create new user
router.post('/user/create', async (req, res) => {

    let username = req.body.username
    let email = req.body.email
    let password = req.body.password
    let displayName = req.body.displayName
    
    try{

    var spc = generateSpecialCode()

    var user = await User.findOne({ username: username , email: email })
    if(!user)
    {
        const user1 = new User({ username,specialCode: spc , email, password, displayName })
        await user1.save()
        res.status(200).send({message: "SUCCESS", user1 })
    }
    else{
        res.status(400).send({ message: "user already exists" })
    }
    }
    catch(e)
    {
        res.status(400).send({ message: "Some error occured", e})
    }

})


//get all users
router.get('/users/', async (req, res) => {
    const list = await User.find()
    res.status(200).send(list)
})


//get user by id
router.get('/user/:id', async (req, res) => {
    try 
    {
        let _id = req.params.id
        const user = await User.findOne({_id})
        if(user)
        {
        res.status(200).send({message: "SUCCESS",user})
        }
        else
        {
            res.status(400).send({message: "user with this id not found"})
        }
    }
    catch (e) 
    {
        res.status(400).send({mesage: "Error occured"})
    }
})


//get user by username
router.get('/users/username', async (req, res) => {
    try 
    {
        let username = req.body.username
        const user = await User.findOne({username})
        if(user)
        {
            res.status(200).send({message: "SUCCESS", user})
        }
        else
        {
            res.status(400).send({message: "User with this username not found", e})
        }
    }
    catch (e) 
    {
        res.status(400).send({mesage: "Error occured", e})
    }
})


//connect to cart
router.post('/connect/user/:id/cart/:cartNumber', async (req, res) => {

    let specialCode = req.body.specialCode
    let cartNumber = req.params.cartNumber
    let _id = req.params.id
    
    if(specialCode == null)
    {
        res.status(400).send({message: "Please enter special Code"})
    }
    else if(cartNumber == null)
    {
        res.status(400).send({message: "Please enter cartNumber"})
    }
    else if(_id == null)
    {
        res.status(400).send({message: "Please enter id"})
    }
    else
    {
        try
        {
            const user = await User.findOne({_id})
            const cart = await Cart.findOne({cartNumber})
            if(!user)
            {
                res.status(400).send({message: "User not found"})
            }
            else if(!cart)
            {
                res.status(400).send({message: "Cart not found"})
            }
            else if(user.cartConnection == true)
            {
                res.status(500).send({message: "User is already connected to a cart"})
            }
            else if(cart.userConnection == true)
            {
                res.status(500).send({message:"Cart is already linked to a user"})
            }
            else if(specialCode != user.specialCode)
            {
                res.status(400).send({message: "Special code mismatch - Please enter correct special Code", expected: user.specialCode, entered: specialCode})
            }
            else
            {
                const dispUser = await User.findOneAndUpdate({ _id },{ cartConnection:true })
                const dispCart = await Cart.findOneAndUpdate({ cartNumber },{ username:user.username , userConnection:true })
                res.status(200).send({message: "SUCCESS",dispCart, dispUser})
            }
            
    }
    catch(e)
    {
        res.status(400).send({ message: "Some error occured", e})
    }

    }

})


//remove cart connection
router.post('/disconnect/user/:id',async (req,res) => {
    
    try
    {
        _id = req.params.id
        const user = await User.findOne({_id})

        if(!user)
        {
            res.status(400).send({message:"User not found"})
        }
        else
        {
            const username = user.username
            const cart = await Cart.findOne({username})
            if(!cart)
            {
                res.status(400).send({message: "User is not connected to any cart"})
            }
            else
            {
                const user1 = await User.findOneAndUpdate({_id},{cartConnection:false})
                const cart1 = await Cart.findOneAndUpdate({ username },{userConnection:false, username:null})
                res.status(200).send({message:"SUCCESS",user1, cart1})
            }
        }
        
    }
    catch(e)
    {
        res.status(400).send({message: "Error occured", e})
    }
})


//delete user
router.delete('/user/:id',async (req,res) => {
    

    try
    {
        let _id = req.params.id
        if(_id == null)
        {
            res.status(400).send({message:"Please enter user id"})
        }
        else
        {
            const user = await User.findOneAndDelete({_id})
            res.status(200).send({message: "SUCCESS",user})
        }
        
    }
    catch(e)
    {
        res.status(500).send({message: "Error occured", e})
    }
})



module.exports = router
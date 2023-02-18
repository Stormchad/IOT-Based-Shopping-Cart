const {UserType, ProductType, CartType, InventoryType } = require("./types")
const { User, Product, Cart, Inventory } = require("../models")
const { GraphQLString, GraphQLInt, GraphQLID, GraphQLBoolean, GraphQLObjectType, GraphQLScalarType, GraphQLNonNull, GraphQLList } = require("graphql")
const { createJwtToken } = require("../util/auth")

const generateSpecialCode = () =>{

  return Math.random().toString(36).slice(2, 7);

}

const createNewCart = {
  type: GraphQLString,
  description:"This is used to create a new Cart",
  args:{
    cartNumber: { type: GraphQLInt }
  },
  async resolve(parents,args){

    const { cartNumber } = args

    const dup = await Cart.findOne({ cartNumber })

    if(dup)
    {
      throw new Error (" cart already exists ")
    }
    else
    {
      const cart1 = new Cart({ cartNumber,userConnection: false })
      await cart1.save()
    }
    

  }
}


const register = {
  type: GraphQLString,
  description: "Register new user",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
  },
  async resolve(parent, args) {

    const { username, email, password, displayName } = args

    var usernameToFind = username
    var emailToFind = email
    var spc = await generateSpecialCode()
    
    var user = await User.findOne({username: usernameToFind, email: emailToFind })
    if(!user)
    {

      const user1 = new User({ username,specialCode: spc, email, password, displayName })
      console.log(user1)


      await user1.save()

      //const token = createJwtToken(user)
      return "success!!!"
    }
    else
    {
      throw new Error("user with this username/email already exists")
    }
    
  }
}



const login = {

  type: GraphQLString,
  description:"user login",
  args:{
    email:{type:GraphQLString},
    password:{type:GraphQLString}
  },
  async resolve(parent,args){

    const user = await User.findOne({email: args.email}).select("+password")
    if(!user || args.password !== user.password)
    {
      throw new Error("Invalid credentials")
    }

    const token = createJwtToken(user)

  }

}


const addProduct = {
  type:GraphQLString,
  description:"add product in database",
  args:{
    productName: {type: GraphQLString},
    productPrice: {type: GraphQLInt},
    productCode: {type: GraphQLString},
  },
  async resolve(parent,args){
    const { productName, productPrice, productCode } = args

    const product = new Product({ productName, productPrice, productCode })
    await product.save()
    return "Product Added!!!"
  }
}

 const addToCart = {
   type: GraphQLString,
   description: "add product to Cart.",
   args:{
     cartNumber:{type: GraphQLInt},
     productCode:{type: GraphQLString}
   },
   async resolve(parent,args){

     const {cartNumber, productCode}  = args

     const productCodeToFind = productCode

     var product = await Product.findOne({productCode: productCodeToFind})
     var cart = await Cart.findOne({cartNumber})
     var inventory = await Inventory.findOne({productCode:productCodeToFind})

     if(!product)
     {
      throw new Error("product with this productId is not found")
     }

     if(!inventory)
     {
      throw new Error("inventory not available for this product")
     }

     if(!cart)
     {
      throw new Error("Cart not found")
     }

     if(cart.userConnection == false)
     {
      throw new Error("Please connect a cart a user first")
     }
     else
     {
      let q = inventory.quantity
      
      var inventory = await Inventory.findOneAndUpdate({productCode:productCodeToFind},{ quantity : q - 1 })

     await Cart.findOneAndUpdate({
        cartNumber
     },{
       $push:{
         products: product
       }
     })
      return `${product.productName} added to cart!!!`
     }
    
   }
 }


const removeFromCart = {
  type: GraphQLString,
  description: "This will remove item from cart",
  args:{

    cartNumber:{type: GraphQLInt},
    productCode:{type: GraphQLString}

  },
  async resolve(parents, args){
    const { cartNumber, productCode } = args
    
    const productCodeToFind = productCode

    var product = await Product.findOne({productCode: productCode})
    var cart = await Cart.find({cartNumber})

    if(!cart)
    {
      throw new Error("Cart not found")
    }

    if(!product)
    {
      throw new Error("product does not exist")
    }


    var inventory = await Inventory.findOne({productCode:productCodeToFind})


      let q = inventory.quantity
      
      var inventory = await Inventory.findOneAndUpdate({productCode:productCodeToFind},{ quantity : q + 1 })

    

    const carts = await Cart.findOneAndUpdate({
      cartNumber
    },{
      
      $pull:{
        products:{
          productCode: productCodeToFind
        }
      }

    })

  }
}

const getTotalBill = {
  type:GraphQLString,
  description: "This will return the sum of all the prices of products in the cart",
  args:{
    cartNumber: {type:GraphQLInt}
  },
  async resolve(parent,args){

    var total = 0;

    const { cartNumber } = args

    const cartFound = await Cart.findOne({cartNumber})
    
    for(var i = 0; i< cartFound.products.length;i++)
    {
      total = total + cartFound.products[i].productPrice
    }

    await Cart.findOneAndUpdate({cartNumber},{$set:{totalBill: total}})

    await Cart.findOneAndUpdate({cartNumber},{ $set: {products:[]}})
    
    return total
  }
}

const payment = {
  type: GraphQLString,
  description: "This will return the sum of all the prices of products in the cart",
  args:{
    cartNumber: {type:GraphQLInt},
    amount: {type:GraphQLInt}
  },
  async resolve(parent,args){

    var total = 0;

    const { cartNumber, amount } = args

    const cartFound = await Cart.findOne({cartNumber})

    if(!cartFound)
    {
      return "cart not found"
    }

    if(cartFound.checkoutComplete == "true")
    {
      return "already checked out!!!"
    }

    if (cartFound.totalBill == amount)
    {
        await Cart.findOneAndUpdate({cartNumber},{$set:{checkoutComplete: true}})
        await Cart.findOneAndUpdate({cartNumber},{$set:{totalBill: 0}})
        return "checkout complete!"
    }
    else
    {
      return `expected amount ${cartFound.totalBill} please try again...`
    }

  }
}




const resetCart = {
  type: GraphQLString,
  description: "This will reset the cart",
  args:{
    cartNumber: {type: GraphQLString}
  },
  async resolve(parent,args){

    const { cartNumber } = args


    const cart = await Cart.findOne({cartNumber})

    if(!cart)
    {
      throw new Error("cannot find cart")
    }
    else
    {
      const cartFound = await Cart.findOneAndUpdate({cartNumber},{ $set: {products:[], totalBill:0, checkoutComplete: false}})
      return "Cart is now reset!!!"
       
    }
    
  }
}


const connectToCart = {
  type: GraphQLString,
  description: "This will connect to cart",
  args:{
    username: {type: GraphQLString},
    specialCode: {type:GraphQLString},
    cartNumber: {type: GraphQLInt}
  },
  async resolve(parent,args){

    const {username, specialCode, cartNumber} = args

    const usernameToFind = username
    const specialCodeToFind = specialCode
    const user = await User.findOne({username: usernameToFind})
    const cart = await Cart.findOne({cartNumber})
    if(!cart)
    {
      throw new Error ("cart not found")
    }
    if(!user){
      throw new Error ("user with this username not found")
    }
    if(user.cartConnection == true)
    {
      throw new Error("user is already connected to a cart")
    }
    if(cart.userConnection == true)
    {
      throw new Error ("this cart is already in use")
    }
    else{
      if (user.specialCode == specialCodeToFind)
      {
        await User.findOneAndUpdate({username:usernameToFind},{cartConnection:true})
        await Cart.findOneAndUpdate({ cartNumber },{username:usernameToFind, userConnection:true})
        return "connected to cart!!!"
      }
      else{
        throw new Error ("incorrect code!!! please enter correct code!!!!")
      }
    }


  }
}

const removeCartConnection = {

  type:GraphQLString,
  description:"To disconnect from cart",
  args:
  {
    cartNumber:{type:GraphQLInt}
  },
  async resolve(parent,args)
  {
    const { cartNumber } = args

    const getCart = await Cart.findOne({ cartNumber })
    let username = getCart.username
    const getUser = await User.findOneAndUpdate({ username })

    if(!getCart)
    {
      return "Cannot find cart."
    }
    else if(!getUser)
    {
      return "User not found"
    }
    else
    {
      await User.findOneAndUpdate({ username }, {$set: {cartConnection:false}})
      await Cart.findOneAndUpdate({ cartNumber },{$set: {userConnection:false}})
      await Cart.findOneAndUpdate({ cartNumber },{$set: {username:null}})
      return "Connection removed!"
    }

  }

}

const checkCartConnection = (cartNumber) => {

    const cart = Cart.findOne({ cartNumber })

    if(cart.userConnection == true)
    {
      return true
    }
    else
    {
      return false
    }

  }



const updateInventory = {
  type:GraphQLString,
  description: "This query is used to add inventory for an item",
  args:{
    productCode:{type:GraphQLString},
    quantity:{type:GraphQLInt}
  },
  async resolve(parent,args){

    const { productCode } = args

    const productCodeToFind = productCode

    
    const { quantity } = args
    const q = quantity

    const product = await Product.findOne({productCode: productCodeToFind })
    const inv = await Inventory.findOne({productCode:productCodeToFind})

    if(!product)
    {
      return "Product not found - Try creating the product first"
    }
    else if(inv)
    {
      await Inventory.findOneAndUpdate({productCode:productCodeToFind},{quantity:q}) 
      return `inventory added for ${productCode}!!`
    }
    else
    {
      var i1 = new Inventory ({productCode:productCodeToFind, quantity:q})
      await i1.save()

      return `inventory added for ${productCode}!!`
    }
    
  }
}



module.exports = { payment, register, login, addProduct, addToCart, resetCart, connectToCart,getTotalBill, removeFromCart,removeCartConnection, createNewCart , updateInventory}
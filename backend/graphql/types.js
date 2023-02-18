const { GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const {User, Product, Inventory , Cart} = require("../models")


  
const UserType = new GraphQLObjectType({
    name: "User",
    description: "User type",
    fields: () => ({
      id: { type: GraphQLID },
      username: { type: GraphQLString },
      email: { type: GraphQLString },
      displayName: { type: GraphQLString },
    }),
  })


//--------------------------------------------------------------------------------------------

const ProductType = new GraphQLObjectType({
    name: "Product",
    description: "Product type",
    fields: () => ({
      id: { type: GraphQLID },
      productName: { type: GraphQLString },
      productPrice: { type: GraphQLInt },
      productCode: { type: GraphQLString },
      
    }),
  })


  //--------------------------------------------------------------------------------------------

const InventoryType = new GraphQLObjectType({
  name: "Inventory",
  description: "Inventory type",
  fields: () => ({
    id: { type: GraphQLID },
    productCode: { type: GraphQLString },
    quantity: { type: GraphQLInt }
    
  }),
})

const CartType = new GraphQLObjectType({
  name: "Cart",
  description: "Cart type",
  fields:() =>({

    cartNumber: { type: GraphQLInt },
    username: { type: GraphQLString },
    totalBill: { type: GraphQLInt }

  })
})


module.exports = { UserType, ProductType, InventoryType, CartType }
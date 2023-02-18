const {GraphQLSchema, GraphQLObjectType} = require("graphql")

// import queries
const { users, products, inventories, carts } = require('./queries')
 
// import mutations
const { payment, register, login, addProduct, addToCart, resetCart, connectToCart, getTotalBill, removeFromCart, removeCartConnection, createNewCart, updateInventory } = require('./mutations')

// define QueryType
const QueryType = new GraphQLObjectType({

    name:"QueryType",
    description:"Queries",
    fields:{ users, products, inventories, carts }

})

// define MutationType
const Mutationtype = new GraphQLObjectType({

    name: "MutationType",
    description:"Mutations",
    fields:{ payment , register, login, addProduct, createNewCart , addToCart, resetCart, connectToCart, getTotalBill, removeFromCart, removeCartConnection, updateInventory} 

})

module.exports = new GraphQLSchema({

    query:QueryType,
    mutation:Mutationtype
    
})
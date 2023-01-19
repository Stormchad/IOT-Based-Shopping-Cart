const {GraphQLSchema, GraphQLObjectType} = require("graphql")

// import queries
const { users, products, inventories, carts } = require('./queries')
 
// import mutations
const { register, login, addProduct, addToCart, resetCart, connectToCart, checkout, removeFromCart, removeCartConnection, createNewCart, checkCartConnection, updateInventory } = require('./mutations')

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
    fields:{register, login, addProduct, createNewCart , addToCart, resetCart, connectToCart, checkout, removeFromCart, removeCartConnection, checkCartConnection,  updateInventory} 

})

module.exports = new GraphQLSchema({

    query:QueryType,
    mutation:Mutationtype
    
})
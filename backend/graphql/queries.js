const { GraphQLList } = require('graphql')
const { UserType, ProductType, InventoryType, CartType } = require('./types')
const { User, Product, Inventory, Cart } = require('../models')

const users = {

    type: new GraphQLList(UserType),
    resolve(parent,args){

        return User.find()

    }
}

const products = {

    type: new GraphQLList(ProductType),
    resolve(parent,args){

        return Product.find()

    }
}

const inventories = {

    type: new GraphQLList(InventoryType),
    resolve(parent,args){

        return Inventory.find()

    }
}

const carts = {
    type: new GraphQLList(CartType),
    resolve(parent,args){

        return Cart.find()

    }
}




module.exports = { users, products, inventories, carts }
const express = require('express')
require('./db/mongoose')
const bp = require('body-parser')
const userRouter = require('./routers/user')
const cartRouter = require('./routers/cart')
const inventoryRouter = require('./routers/inventory')
const productRouter = require('./routers/product')

const app = express()


app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(express.json())

app.use(userRouter)
app.use(productRouter)
app.use(cartRouter)
app.use(inventoryRouter)

module.exports = app
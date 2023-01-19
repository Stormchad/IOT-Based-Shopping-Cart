const express =  require('express')
const dotenv = require('dotenv') // for environment variables
const { graphqlHTTP } = require("express-graphql")

const { connectDB } = require("./db")
const schema  = require("./graphql/schema")

dotenv.config() // configuring env variables

connectDB()
// function to connect to db -> it is configured in db/index.js


const app = express()



app.use("/graphql",graphqlHTTP({

    schema:schema,
    graphiql:true

}))


app.listen(process.env.PORT, ()=>{

    console.log(`server is up and running on ${process.env.PORT}`)

})
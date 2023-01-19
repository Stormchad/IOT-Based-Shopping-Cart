const jwt = require('jsonwebtoken')


const createJwtToken = user => {

    return jwt.sign({user}, process.env.JWT_SECRET, {

        expiresIn: "30 days"

    })

}

module.exports = { createJwtToken }
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const dotenv = require('dotenv');
dotenv.config()


const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('bearer ', '')
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        const username = decoded.user.username

        const user = await User.findOne({ username })

        if (!user) {
            throw new Error()
        }

        next()
    } catch (e) {
        res.status(401).send({ error: "Please authenticate.",e })
    }
}

module.exports = verifyToken
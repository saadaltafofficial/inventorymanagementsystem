const jwt = require('jsonwebtoken')
require('dotenv').config()

function userMiddleware(req, res, next){
    const token = req.headers.token

    if(!token){
        return res.status(403).json({
            message: "Unauthorized"
        })
    }
    try {
        const decodeToken = jwt.verify(token, process.env.JWT_USER_SECRET)
        if(decodeToken.id){
            req.userId = decodeToken.id
            console.log(decodeToken.id)
            next()
        }
        
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            message: "Unauthorized",
            signedIn: false
        })
    }
}

module.exports = {
    userMiddleware
}
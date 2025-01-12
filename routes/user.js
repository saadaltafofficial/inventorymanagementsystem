const express = require('express')
const userRouter = express.Router()
const { loggerMiddleware } = require('../utils/auth')
const { userMiddleware } = require('../middlewares/user')
const { z, string, boolean } = require('zod')
const bcrypt = require('bcrypt');
const { userModel } = require('../utils/db')
const time = new Date()
const timezone = time.toISOString()
const jwt = require('jsonwebtoken')

userRouter.post('/signup', loggerMiddleware, async function(req, res){
    const requiredData = z.object({
        email: string().max(50),
        username: string().max(20),
        password: string().max(50)
    })
    const parsedData = requiredData.safeParse(req.body)
    
    if(!parsedData.success){
        return res.status(403).json({
            message: "Invalid Details added!"
        })
    }

    const { email, username, password } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 5)
        if(hashedPassword){
            await userModel.create({
                email: email,
                username: username,
                password: hashedPassword,
                time: timezone
            })
        }
        res.json({
            message: `User ${email} signed up.`
        })
        
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            message: "Something went wrong!"
        })
    }

})

userRouter.post('/signin', loggerMiddleware, async function(req, res){
    const requiredData = z.object({
        email: string().max(50),
        password: string().max(50)
    })
    const parsedData = requiredData.safeParse(req.body)
    
    if(!parsedData.success){
        return res.status(403).json({
            message: "Invalid Details added!"
        })
    }

    const { email, password } = req.body

    try {
        const user = await userModel.findOne({
            email: email,
        })
        const comparePassword = await bcrypt.compare(password, user.password)

        if(!user || !comparePassword){
            return res.status(403).json({
                message: "Oops! Incorrect credentials"
            })
        }
        if(user && comparePassword){
            const token = jwt.sign({
                id: user._id
            }, process.env.JWT_USER_SECRET)
            res.json({
                token: token
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            message: "Incorrect credentials"
        })
    }

})


module.exports = {
    userRouter
}
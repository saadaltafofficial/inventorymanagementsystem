const express = require('express')
const { loggerMiddleware } = require('../utils/auth')
const { adminMiddleware } = require('../middlewares/admin')
const adminRouter = express.Router()
const bcrypt = require('bcrypt')
const { z, string } = require('zod')
const { adminModel, itemModel, qrcodeModel } = require('../utils/db')
const jwt = require('jsonwebtoken')
const time = new Date()
const timezone = time.toISOString()
const QRCode = require('qrcode')
const { uploadOnCloudinary } = require('../utils/cloudinary')

adminRouter.post('/signup', loggerMiddleware, async function(req, res){
    const requiredData = z.object({
        email: string().max(100),
        username: string().max(20),
        password: string().max(50)
    })
    const parsedData = requiredData.safeParse(req.body)
    
    if(!parsedData.success){
        return res.status(403).json({
            message: "Invalid Details added!",
            error: parsedData.error.issues
        })
    }

    const { email, username, password } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 5)
        if(hashedPassword){
            await adminModel.create({
                email: email,
                username: username,
                password: hashedPassword,
                time: timezone
            })
        }
        res.json({
            message: `Admin ${email} signed up`
        })
        
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            message: "Something went wrong!"
        })
    }

})

adminRouter.post('/signin', loggerMiddleware, async function(req, res){
    const requiredData = z.object({
        email: string().max(50),
        password: string().max(50)
    })
    const parsedData = requiredData.safeParse(req.body)
    
    if(!parsedData.success){
        return res.json({
            message: "Invalid Details added!",
            signedIn: false
        })
    }

    const { email, password } = req.body

    try {
        const admin = await adminModel.findOne({
            email: email,
        })

        if(!admin){
            return res.json({
                message: "Oops! Incorrect credentials",
                signedIn: false
            })
        }

        else if(admin){
            const comparePassword = await bcrypt.compare(password, admin.password)
            if(!comparePassword){
                return res.json({
                    message: "Invalid password provided!",
                    signedIn: false
                })
            }
            const token = jwt.sign({
                id: admin._id
            }, process.env.JWT_ADMIN_SECRET)
            res.json({
                token: token,
                signedIn: true
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            message: "Incorrect credentials",
            signedIn: false
        })
    }

})

adminRouter.post('/createitem', loggerMiddleware, adminMiddleware, async function(req, res) {
    const adminId = req.userId
    const requiredData = z.object({
        name: string(),
        team: string(),
        item: string(),
        description: string(),
        status: string(),
    })

    const parsedData = requiredData.safeParse(req.body)

    if(!parsedData.success){
        return res.status(404).json({
            message: "Invalid Data provided"
        })
    }

    const { name, team, description, item,  status } = req.body

    const itemall = await itemModel.create({
        name: name,
        team: team,
        item: item,
        description: description,
        status: status,
        time: timezone,
        creatorId: adminId,
    })
    res.json({
        message: "item created",
        item: itemall._id
    })
})

adminRouter.post('/generateqr', loggerMiddleware, adminMiddleware, async function(req, res) {
    const adminId = req.userId
    const itemId = req.body.itemId

    try {
        const adminCheck = await adminModel.findById({
            _id: adminId
        })
        const qrCodeCheck = await qrcodeModel.findOne({
            itemId: itemId
        })
        const itemCheck = await itemModel.findOne({
            _id: itemId
        })

        if(!itemCheck){
            return res.status(404).json({
                message: "No item found"
            })
        }
        
        if(qrCodeCheck){
            return res.status(404).json({
                message: "QrCode already generated!",
                qrCodegenerated: true
            })
        }
        if(adminCheck.username){
            await QRCode.toDataURL(`http://localhost:3000/items/item/${itemId}`, async function (err, url) {
                if(err){
                    throw Error(err)
                }
                const qrImage = await uploadOnCloudinary(url, itemId)
    
                await qrcodeModel.create({
                    qrCodeImage: qrImage.url,
                    itemId: itemId
                })
            }) 
            
            res.json({
                message: `QrCode for item ${itemId} is generated!`,
                qrCodegenerated: true
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            message: "Something went wrong!"
        })        
    }

})

adminRouter.put('/updateitem/:itemId', loggerMiddleware, adminMiddleware, async function(req, res){
    const adminId = req.userId
    const itemId = req.params.itemId

    const requiredData = z.object({
        name: string(),
        team: string(),
        item: string(),
        description: string(),
        status: string(),
    })

    const parsedData = requiredData.safeParse(req.body)
    
    if(!parsedData.success){
        return res.status(404).json({
            message: "Invalid Data provided"
        })
    }

    const { name, team, item, description, status } = req.body

    console.log(name, team, item)
    
    try {
        const itemCheck = await itemModel.findOne({
            _id: itemId,
            creatorId: adminId
        })

        console.log(itemCheck)

        if(!itemCheck){
            return res.status(404).json({
                message: "Unauthorized or item not found"
            })
        }

        await itemModel.updateOne({
            _id: itemId
        },{
            name: name,
            team: team,
            item: item,
            description: description,
            status: status
        })
        res.json({
            message: `Items of ${itemId} are updated.`
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            message: "Something went wrong!"
        })
    }

})

adminRouter.delete('/deleteitem', loggerMiddleware, adminMiddleware, async function(req, res) {
    const adminId=req.userId
    const itemId=req.body.itemId

    console.log(adminId)
    console.log(itemId)
    
    try{
        const checkItem = await itemModel.findOne({
            _id: itemId,
            creatorId: adminId
        })

        if(checkItem){
            await itemModel.deleteOne({
                _id: itemId,
                creatorId: adminId
            })
            await qrcodeModel.deleteOne({
                itemId: itemId
            })
            res.json({
                message: "Item deleted"
            })
        } else {
            return res.json({
                message: "No item found"
            }) 
        }
    } catch(error) {
        console.log(error)
        return res.json({
            message: "Something went wrong!"
        })        
    }
})

module.exports = {
    adminRouter
}
const express = require('express')
const { loggerMiddleware } = require('../utils/auth')
const { itemModel, qrcodeModel } = require('../utils/db')
const itemRouter = express.Router()



itemRouter.get('/item/:itemId', loggerMiddleware, async function(req, res){
    const itemId = req.params.itemId

    try {
        const itemCheck = await itemModel.findOne({
            _id: itemId
        })
        
        const qrCodeCheck = await qrcodeModel.findOne({
            itemId: itemId
        })

        if(!itemCheck){
            return res.json({
                message: "Item not found"
            })
        }

        res.json({
            item: itemCheck,
            qrcode: qrCodeCheck
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            message: "Something went wrong!"
        })
    }
})

itemRouter.get('/allitems', loggerMiddleware, async function(req, res){

    const allitems = await itemModel.find({})
    res.json({
        items: allitems
    })
})

module.exports = {
    itemRouter
}

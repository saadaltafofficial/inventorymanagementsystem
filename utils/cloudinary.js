const fs = require('fs')
const cloudinary = require("cloudinary").v2;
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, Id) => {
    try {
        if(!localFilePath){
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath,  { folder: "images", resource_type: "auto", public_id: `${Id}`});        
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

module.exports = {
    uploadOnCloudinary
}



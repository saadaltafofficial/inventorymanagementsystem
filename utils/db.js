const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const userSchema = new Schema({
  email: { type: String, unique: true},
  username: String,
  password: String,
  time: String
})

const adminSchema = new Schema({
  email: { type: String, unique: true},
  username: String,
  password: String,
  time: String
})

const itemSchema = new Schema({
  name: String,
  team: String,
  item: String,
  description: String,
  status: String,
  time: String,
  creatorId: ObjectId
});

const qrCodeSchema = new Schema({
  qrCodeImage: String,
  itemId: ObjectId
})

const userModel = mongoose.model('user', userSchema)
const adminModel = mongoose.model('admin', adminSchema)
const itemModel = mongoose.model('items', itemSchema)
const qrcodeModel = mongoose.model('qrcodes', qrCodeSchema)

module.exports = {
  userModel,
  adminModel,
  itemModel,
  qrcodeModel
}

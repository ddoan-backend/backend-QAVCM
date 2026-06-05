const mongoose = require("mongoose")

const menuSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    image: String,
},{collection:"Menus"})

module.exports = mongoose.model("Menu", menuSchema)
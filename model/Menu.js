const mongoose = require("mongoose")

const menuSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    image: String,
},{collection:"menus"})

module.exports = mongoose.model("Menu", menuSchema)
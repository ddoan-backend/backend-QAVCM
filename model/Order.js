const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  tableId: String,
  items: Array,
  status: {
    type: String,
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Order = mongoose.model("Order", orderSchema)

module.exports = Order
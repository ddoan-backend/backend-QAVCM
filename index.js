const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const Order = require("./model/Order")  // import model
const Menu = require("./model/Menu.js")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/quan-an")
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch((err) => console.log("Lỗi kết nối:", err))

app.get("/", (req, res) => {
  res.json({ message: "Server đang chạy!" })
})

app.post("/api/orders", async (req, res) => {
  const { tableId, items } = req.body

  // lưu vào DB
  const newOrder = await Order.create({ tableId, items })

  console.log("Order mới:", newOrder)
  res.json({ message: "Đặt món thành công!", order: newOrder })
})
app.get("/api/menus", async (req, res) => {
    const menus = await Menu.find()
    res.json(menus)
})

app.listen(3000, () => {
  console.log("Server chạy ở port 3000")
})